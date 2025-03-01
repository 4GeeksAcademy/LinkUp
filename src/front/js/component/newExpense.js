import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/newExpense.css";
import { Link } from "react-router-dom";

export const NewExpense = ({ membersList, theid }) => {
    const { store, actions } = useContext(Context);
    const formRef = useRef(null);
    const modalRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        paidFor: "",
        balance: {},
        file: null,
        date: "",
        checked: membersList.reduce((acc, member) => {
            acc[member.name.toLowerCase()] = true;
            return acc;
        }, {}),
    });

    useEffect(() => {
        const checked = membersList.reduce((acc, member) => {
            acc[member.name.toLowerCase()] = true;
            return acc;
        }, {});

        setFormData(prevData => ({
            ...prevData,
            checked,
        }));
        setFormData(prevData => ({
            ...prevData,
            paidFor: membersList[0].name,
        }));

    }, [membersList]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFormData({
                ...formData,
                file: selectedFile
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (person) => {
        setFormData((prevFormData) => {
            const newChecked = { ...prevFormData.checked, [person]: !prevFormData.checked[person] };
            const activePeople = Object.values(newChecked).filter((isChecked) => isChecked).length;
            if (activePeople > 0) {
                return { ...prevFormData, checked: newChecked };
            } else {
                newChecked[person] = true;
                return { ...prevFormData, checked: newChecked };
            }
        });
    };

    const calculatePrice = (person) => {
        const activePeople = Object.keys(formData.checked).filter((name) => formData.checked[name]).length;
        return formData.checked[person] ? (formData.amount / activePeople).toFixed(2) : '0.00';
    };

    const handleSelectAll = () => {
        const allChecked = Object.values(formData.checked).every((isChecked) => isChecked);
        setFormData((prevFormData) => {
            const newChecked = {};
            Object.keys(prevFormData.checked).forEach((person) => {
                newChecked[person] = !allChecked;
            });
            return { ...prevFormData, checked: newChecked };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = formRef.current;

        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add("was-validated");
        } else {
            const activePeople = Object.keys(formData.checked).filter(person => formData.checked[person]);
            const balance = activePeople.map(person => ({
                name: person.charAt(0).toUpperCase() + person.slice(1),  // Capitaliza el nombre
                amount: (formData.amount / activePeople.length).toFixed(2)
            }));

            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];

            const expenseData = {
                title: formData.title,
                amount: parseFloat(formData.amount).toFixed(2),  // Asegura que la cantidad esté bien formateada
                paidFor: formData.paidFor,
                balance: balance,
                imageURL: formData.file ? URL.createObjectURL(formData.file) : "",  // Asume que si hay archivo, lo usa
                date: formattedDate,
            };

            console.log(expenseData);
            actions.addExpense(theid, expenseData);
            console.log(actions.getGroup(theid));

            form.classList.remove("was-validated");
            form.reset();

            setFormData({
                title: "",
                amount: "",
                paidFor: membersList[0].name,
                checked: membersList.reduce((acc, member) => {
                    acc[member.name.toLowerCase()] = true;
                    return acc;
                }, {}),
                file: null,
                date: formattedDate,
            });

            const modal = document.querySelector("#newExpenseModal");
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
            }
        }
    };

    return (
        <div className="modal fade" id="newExpenseModal" tabIndex="-1" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content bg-c3 modal-rounded">
                    <div className="d-flex align-items-center justify-content-between pt-3">
                        <div></div>
                        <h1 className="fs-5 text-c5"><strong>Añadir nuevo gasto</strong></h1>
                        <div></div>
                    </div>

                    <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
                        <div className="m-4" style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
                            <div className="col-md-12 col-lg-12">
                                <div className="row g-3">
                                    <div className="col-sm-12">
                                        <label htmlFor="title" className="form-label text-c5">Título del gasto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            placeholder="P. ej.: Carne barbacoa"
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">
                                            Se requiere un título.
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="amount" className="form-label text-c5">Importe</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" aria-label="" id="amount"
                                                name="amount"
                                                placeholder="0.000€"
                                                required
                                                value={formData.amount}
                                                onChange={handleChange} />
                                            <span className="input-group-text">€</span>
                                            <span className="input-group-text">0.00</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="paidFor" className="form-label text-c5">Pagado por</label>
                                        <select
                                            className="form-select"
                                            id="paidFor"
                                            name="paidFor"
                                            value={formData.paidFor}
                                            onChange={handleChange}
                                        >
                                            {membersList.map((person) => (
                                                <option value={person.name} key={person.name}>{person.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-sm-12">
                                        <label htmlFor="fileUpload" className="form-label text-c5">Subir Foto</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="fileUpload"
                                            name="fileUpload"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {formData.file && <p className="mt-2">Archivo seleccionado: {formData.file.name}</p>}
                                    </div>
                                </div>

                                <div className="input-group mb-3 mt-4">
                                    <div className="input-group-text">
                                        <input
                                            className="form-check-input mt-0"
                                            type="checkbox"
                                            checked={Object.values(formData.checked).every((isChecked) => isChecked)}
                                            onChange={handleSelectAll}
                                        />
                                    </div>
                                    <span className="input-group-text">Dividir entre todos</span>
                                </div>

                                {membersList.map((person) => (
                                    <div className="input-group mb-1" key={person.name}>
                                        <div className="input-group-text">
                                            <input
                                                className="form-check-input mt-0"
                                                type="checkbox"
                                                checked={formData.checked[person.name.toLowerCase()]}
                                                onChange={() => handleCheckboxChange(person.name.toLowerCase())}
                                            />
                                        </div>
                                        <span className="input-group-text flex-grow-1">{person.name.charAt(0).toUpperCase() + person.name.slice(1)}</span>
                                        <span className="input-group-text">{calculatePrice(person.name.toLowerCase())}€</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-3">
                            <button type="button" className="btn btn-light mx-3" data-bs-dismiss="modal">Cerrar</button>
                            <button className="btn btn-primary mx-3" type="submit">Añadir gasto</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

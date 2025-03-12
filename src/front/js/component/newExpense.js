import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/newExpense.css";

export const NewExpense = ({ theid }) => {
    const { store, actions } = useContext(Context);
    const formRef = useRef(null);
    const modalRef = useRef(null);
    const [membersList, setMembersList] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        paidFor: "",
        balance: {},
        file: "",
        date: "",
        checked: {},
    });

    useEffect(() => {
        if (!theid) return;

        const fetchMembers = async () => {
            const fetchedMembers = await actions.getGroupMembers(theid);
            setMembersList(fetchedMembers.members);

            const initialChecked = fetchedMembers.members.reduce((acc, person) => {
                acc[person.name.toLowerCase()] = true;
                return acc;
            }, {});
            setFormData((prevState) => ({
                ...prevState,
                checked: initialChecked,
                paidFor: fetchedMembers.members[0].name,
            }));
        };
        fetchMembers();
    }, [theid, actions]);

    const handleCheckboxChange = (name) => {
        setFormData((prevState) => {
            const newChecked = { ...prevState.checked, [name]: !prevState.checked[name] };
            return { ...prevState, checked: newChecked };
        });
    };

    const handleSelectAll = () => {
        const newChecked = membersList.reduce((acc, person) => {
            acc[person.name.toLowerCase()] = true;
            return acc;
        }, {});
        setFormData((prevState) => ({ ...prevState, checked: newChecked }));
    };

    const handleDeselectAll = () => {
        const newChecked = membersList.reduce((acc, person) => {
            acc[person.name.toLowerCase()] = false;
            return acc;
        }, {});
        setFormData((prevState) => ({ ...prevState, checked: newChecked }));
    };

    const handleToggleSelectAll = () => {
        if (Object.values(formData.checked).every((isChecked) => isChecked)) {
            handleDeselectAll();
        } else {
            handleSelectAll();
        }
    };

    const calculatePrice = (name) => {
        if (formData.checked[name.toLowerCase()]) {
            return (parseFloat(formData.amount || 0) / Object.keys(formData.checked).filter((key) => formData.checked[key]).length).toFixed(2);
        } else {
            return "0.00";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {

        const imgURL = actions.uploadImage(e.target.files[0]);
        setFormData((prevState) => ({
            ...prevState,
            file: imgURL,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const balance = membersList
            .filter((person) => formData.checked[person.name.toLowerCase()] && calculatePrice(person.name) !== "0.00")
            .map((person) => ({
                name: person.name,
                amount: calculatePrice(person.name),
            }));

        const expenseData = {
            title: formData.title,
            amount: parseFloat(formData.amount || 0).toFixed(2),
            paidFor: formData.paidFor,
            balance: balance,
            imageURL: formData.file,
            date: formData.date || new Date().toLocaleDateString("en-GB").split("/").join("-"),
        };

        console.log(expenseData);

        const fetchNewExpense = async () => {
            const fetchedResponse = await actions.createExpense(expenseData, theid);
            window.location.href = `/group/${theid}`;
        };
        fetchNewExpense();

        if (modalRef.current) {
            const modal = bootstrap.Modal.getInstance(modalRef.current);
            modal.hide();
        }

        setFormData({
            title: "",
            amount: "",
            paidFor: membersList[0]?.name || "",
            balance: {},
            file: null,
            date: "",
            checked: membersList.reduce((acc, person) => {
                acc[person.name.toLowerCase()] = true;
                return acc;
            }, {}),
        });
    };

    const isFormValid = formData.title && formData.amount && Object.values(formData.checked).includes(true);

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
                                        <div className="invalid-feedback">Se requiere un título.</div>
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="amount" className="form-label text-c5">Importe</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="amount"
                                                name="amount"
                                                placeholder="0.000€"
                                                required
                                                value={formData.amount}
                                                onChange={handleChange}
                                            />
                                            <span className="input-group-text">€</span>
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
                                            onChange={handleToggleSelectAll}
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
                                                checked={formData.checked[person.name.toLowerCase()] || false} // Siempre controlado
                                                onChange={() => handleCheckboxChange(person.name.toLowerCase())}
                                            />
                                        </div>
                                        <span className="input-group-text flex-grow-1">{person.name.charAt(0).toUpperCase() + person.name.slice(1)}</span>
                                        <span className="input-group-text">{calculatePrice(person.name)}€</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-3">
                            <button type="button" className="btn btn-light mx-3" data-bs-dismiss="modal">Cerrar</button>
                            <button className="btn btn-primary mx-3" type="submit" disabled={!isFormValid}>Añadir gasto</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

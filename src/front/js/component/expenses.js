import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { ImagenAmpliadaModal } from "../component/imagenAmpliadaModal.js";
import "../../styles/index.css";

export const Expenses = ({ theid }) => {
    const { store, actions } = useContext(Context);
    const [group, setGroup] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen ampliada

    useEffect(() => {
        const fetchGroup = async () => {
            const fetchedGroup = await actions.getGroup(theid);
            setGroup(fetchedGroup);
        };
        fetchGroup();
    }, [theid, actions]);

    if (!group) return <div>Loading...</div>;

    return (
        <div className="flex-grow-1 m-3 bg-c2 group-detail">
            <ImagenAmpliadaModal imageURL={selectedImage} />

            <h2>Gastos</h2>
            <div className="mx-4 mt-4">
                {group.expensesList.map((expense, index) => (
                    <div key={index} className="bg-c3 balance d-flex align-items-center justify-content-between my-3 px-3 text-light">
                        <button className="text-start btn text-light">
                            <h5 className="">{expense.title}</h5>
                            <p>Pagado por {expense.paidFor} el {expense.date}</p>
                        </button>
                        <h5 className="ps-2">{expense.amount}€</h5>
                        {expense.imageURL && (
                            <button 
                                className="btn" 
                                data-bs-toggle="modal" 
                                data-bs-target="#imagenAmpliadaModal"
                                onClick={() => setSelectedImage(expense.imageURL)}
                            >
                                <img src={expense.imageURL} alt={expense.title} className="imagen-gasto" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

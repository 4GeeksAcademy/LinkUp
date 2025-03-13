import api from "../api";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			imageURL: "",
			prepareEmailInvitate: {
				emailTosend: "",
				refGroup: null 
			},
			groups: [

			],
			actualGroup: [

			],


		},
		actions: {

			getGroup: async (idGroup) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/group/" + idGroup)
					const data = await resp.json()
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			getExpensesList: async (idGroup) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/expenses/" + idGroup)
					const data = await resp.json()
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			getExpense: async (idEexpense) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/expense/" + idEexpense)
					const data = await resp.json()
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			getGroupMembers: async (idGroup) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/group/" + idGroup + "/members")
					const data = await resp.json()
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			deleteExpense: async (idExpense) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/expense/" + idExpense, {
						method: "DELETE",
					});

					if (!resp.ok) {
						throw new Error("Error deleting expense");
					}

					const data = await resp.json();
					return data;
				} catch (error) {
					console.log("Error deleting expense", error);
				}
			},
			createGroup: async (groupBody) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/groups", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(groupBody),
					});

					if (!resp.ok) {
						console.log(resp);
						throw new Error("Error creating group");


					}

					const data = await resp.json();
					return data;
				} catch (error) {
					console.log("Error creating group", error);
				}
			},
			getGroups: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/user_groups/" + localStorage.getItem('email'))

					const data = await resp.json()
					console.log(data);

					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			deleteGroup: async (idGroup) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/group/" + idGroup, {
						method: "DELETE",
					});

					if (!resp.ok) {
						throw new Error("Error deleting group");
					}

					const data = await resp.json();
					return data;
				} catch (error) {
					console.log("Error deleting group", error);
				}
			},
			removeUserEmail: async (idMember) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/remove_user_email/" + idMember, {
						method: "DELETE",
					});

					if (!resp.ok) {
						throw new Error("Error removing email");
					}

					const data = await resp.json();
					return data;
				} catch (error) {
					console.log("Error removing email", error);
				}
			},
			createExpense: async (expenseBody, idGroup) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/expenses/" + idGroup, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(expenseBody),
					});

					if (!resp.ok) {
						console.log(resp);
						throw new Error("Error creating group");
					}


					const data = await resp.json();
					return data;
				} catch (error) {
					console.log("Error creating group", error);
				}
			},
			payMember: async (payMemberBody, idGroup) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/pay/" + idGroup, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(payMemberBody),
					});

					if (!resp.ok) {
						console.log(resp);
						throw new Error("Error paying");
					}


					const data = await resp.json();
					return data;
				} catch (error) {
					console.log("Error paying", error);
				}
			},





			addExpense: (idGroup, expense) => {
				const store = getStore();
				const group = store.groups.find(group => group.id === idGroup);
				if (group) {
					group.expensesList.push(expense);
					setStore(store);
				}
			},

			uploadImage: async (file) => {


				const token = localStorage.getItem("token");
				console.log("Token actual:", token);

				if (!token) {
					console.error("Antes debes iniciar sesion. No se puede subir la imagen.");
					return;
				}


				const formData = new FormData();
				formData.append("file", file);


				try {



					const response = await api.post("/upload", formData, {
						headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
					});

					if (response.data.url_foto) {
						setStore({ imageURL: response.data.url_foto });
						console.log("Imagen subida con exito", response.data.url_foto);
						return response.data.url_foto;

					}
				} catch (error) {
					console.error("Error al subir la imagen: ", error.response?.data || error.message);

				}
			},

			getUserGroups: () => {
				const store = getStore();
				return store.groups;
			},
			postGroup: () => {
				const store = getStore();
				return store.groups;
			},

			inviteUser: (email, idGroup) => {
				if (!email) {
					console.error("Error: el email no está definido.");
					return { success: false, message: "Email requerido" };
				}
			
				// Obtener el store actual
				const store = getStore();
			
				// Actualizar el store con los nuevos datos
				setStore({
					...store, // Mantener el estado anterior
					prepareEmailInvitate: {
						emailTosend: email,  // 📌 Aquí ya usamos el email recibido
						refGroup: idGroup
					}
				});
			
				console.log("Estado actualizado:", getStore().prepareEmailInvitate);
				return { success: true, message: "Invitación guardada correctamente" };
			},


		}
	};
};

export default getState;

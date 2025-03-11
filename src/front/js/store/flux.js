import api from "../api";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			imageURL: "",
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
				console.log(groupBody);


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
					console.log("Error creating group", error); // Mensaje de error corregido
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


		}
	};
};

export default getState;

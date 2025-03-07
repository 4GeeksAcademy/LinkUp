import api from "../api";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			imageURL: "",
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			groups: [
				{
					name: "Debug Group",
					id: "debug",
					membersList: [
						{
							name: "Arnau",
							owes: [
								{
									to: "Nacho",
									amount: 0,
								},
								{
									to: "Domingo",
									amount: 2,
								},
								{
									to: "Mohamed",
									amount: 3,
								},
							]
						},
						{
							name: "Nacho",
							owes: [
								{
									to: "Arnau",
									amount: 4,
								},
								{
									to: "Domingo",
									amount: 5,
								},
								{
									to: "Mohamed",
									amount: 6,
								},
							]
						},
						{
							name: "Domingo",
							owes: [
								{
									to: "Nacho",
									amount: "7",
								},
								{
									to: "Arnau",
									amount: 8,
								},
								{
									to: "Mohamed",
									amount: 9,
								},
							]
						},
						{
							name: "Mohamed",
							owes: [
								{
									to: "Nacho",
									amount: 10,
								},
								{
									to: "Domingo",
									amount: 11,
								},
								{
									to: "Arnau",
									amount: 12,
								},
							]
						},
					],
					expensesList: [
						{
							title: "Barbacoa",
							amount: 50,
							paidFor: "Arnau",
							balance: [{
								name: "Arnau",
								amount: 12.5,
							}, {
								name: "Domingo",
								amount: 12.5,
							}, {
								name: "Nacho",
								amount: 12.5,
							}, {
								name: "Mohamed",
								amount: 12.5,
							}],
							imageURL: "https://catinfog.com/wp-content/uploads/2019/01/ticket-pepejeans-1.jpg",
							date: "10-02-2025",
						},
						{
							title: "Cena",
							amount: 75,
							paidFor: "Nacho",
							balance: [{
								name: "Arnau",
								amount: 25,
							}, {
								name: "Domingo",
								amount: 0,
							}, {
								name: "Nacho",
								amount: 25,
							}, {
								name: "Mohamed",
								amount: 25,
							}],
							imageURL: "",
							date: "19-02-2025",
						},
					]

				}
			]
			

		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			getGroup: (idGroup) => {
				const store = getStore();

				return store.groups.find(group => group.id === idGroup);
			},
			addExpense: (idGroup, expense) => {
				const store = getStore();
				const group = store.groups.find(group => group.id === idGroup);
				if (group) {
					group.expensesList.push(expense);
					setStore(store);
				}
			},
			uploadImage: async (file)=>{


				const token = localStorage.getItem("token"); 
				console.log("Token actual:", token);

				if (!token) {
					console.error("Antes debes iniciar sesion. No se puede subir la imagen.");
					return;
				}


				const formData = new FormData();
				formData.append("file", file);


				try {
					

					
					const response = await api.post("/upload",formData, {
						headers: {"Content-Type": "multipart/form-data", Authorization:`Bearer ${token}`}});
					
					if(response.data.url_foto){
						setStore({ imageURL: response.data.url_foto});
						console.log("Imagen subida con exito", response.data.url_foto);
						
					}
				}catch(error){
					console.error("Error al subir la imagen: ", error.response?.data || error.message);
					
				}
			}

		}
	};
};

export default getState;

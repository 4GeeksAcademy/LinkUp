const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
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
							balance: {
								arnau: 12.5,
								domingo: 12.5,
								nacho: 12.5,
								mohamed: 12.5,
							},
							imageURL: "https://catinfog.com/wp-content/uploads/2019/01/ticket-pepejeans-1.jpg",
							date: "10-02-2025",
						},
						{
							title: "Cena",
							amount: 75,
							paidFor: "Nacho",
							balance: {
								arnau: 25,
								domingo: 0,
								nacho: 25,
								mohamed: 25,
							},
							imageURL: "data:image/webp;base64,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",
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
		}
	};
};

export default getState;

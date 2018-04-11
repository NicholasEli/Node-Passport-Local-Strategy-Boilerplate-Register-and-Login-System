window.onload = () => {
	axios.post('/register')
	.then((res) => {
		console.log(res)
	})
	.catch((err) => {
		console.error(err)
	})
}
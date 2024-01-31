import axios from "axios"
export  default function componentDidMount(baseUrl) {
    axios(baseUrl).then(resp =>{
        this.setState({ list:resp.data })
    })
}
import React, { Component } from "react"
import Main from '../templates/main'
import axios from "axios"

const headerProps = {
    icon: "soccer-ball-o",
    title: "Produtos",
    subtitle: "Criar, Listar, Atualizar e Deletar produtos!"
}

const baseUrl = 'http://localhost:3001/products'
const initialState = {
    product: {
        name: '',
        brand: '',
        price: ''
    }, list: []
}

export default class ProductCrud extends Component {
    state = { ...initialState }

    componentDidMount() {
        axios(baseUrl).then(resp =>{
            this.setState({ list:resp.data })
        })
    }

    clear() {
        this.setState({ product: initialState.product })
    }

    save() {
        const product = this.state.product
        const method = product.id ? 'put' : 'post'
        const url = product.id ? `${baseUrl}/${product.id}` : baseUrl

        axios[method](url, product).then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ product: initialState.product, list })
        })
    }

    getUpdatedList(product, add = true) {
        const list = this.state.list.filter(p => p.id !== product.id)
        if(add) list.unshift(product)
        return list
    }

    updateField(event) {
        const product = { ...this.state.product }
        product[event.target.name] = event.target.value
        this.setState({ product })
    }



    renderForm() {
        return (
            <div className="form">
                <div className="row">

                    <div className="col-12 md-6">
                        <div className="form-group">
                            <label >Nome</label>
                            <input type="text" className="form-control" name="name"
                                value={this.state.product.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome do produto..." />
                        </div>
                    </div>


                    <div className="col-12 md-6">
                        <div className="form-group">
                            <label >Marca</label>
                            <input type="text" className="form-control" name="brand"
                                value={this.state.product.brand}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a marca do produto..." />
                        </div>
                    </div>

                    <div className="col-12 md-6">
                        <div className="form-group">
                            <label >Preço</label>
                            <input type="number" className="form-control" name="price"
                                value={this.state.product.price}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o preço do produto..." />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary mt-3 m-2"
                            onClick={() => this.save()}>
                            Salvar
                        </button>
                        <button className="btn btn-secondary mt-3 m-2"
                            onClick={() => this.clear()}>
                            Cancelar
                        </button>
                    </div>
                </div>
                <hr />
            </div>
        )
    }

    load(product) {
        this.setState({ product })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th className="text-center px-4" >ID</th>
                        <th className="text-center px-4" >Nome</th>
                        <th className="text-center px-4" >Marca</th>
                        <th className="text-center px-4" >Preço</th>
                        <th className="text-center px-4" >Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(product => {
            return (
                <tr  key={product.id}>
                    <td className="text-center px-4" >{product.id}</td>
                    <td className="text-center px-4" >{product.name}</td>
                    <td className="text-center px-4" >{product.brand}</td>
                    <td className="text-center px-4" >{product.price}</td>
                    <td className="text-center px-4" >
                        <button 
                        onClick={() => this.load(product)}
                        className="btn btn-warning m-1">
                            <i className="fa  fa-pencil"></i>
                        </button>
                        <button 
                        onClick={() => this.remove(product)}
                        className="btn btn-danger m-1">
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}

            </Main>
        )
    }
}
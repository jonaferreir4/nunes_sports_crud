import React, { Component } from "react";
import Main from '../templates/main'
import axios from 'axios'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Criar, Listar, Atualizar e Deletar usuários!'
}

const baseUrl = 'http://localhost:3001/users'
const initialState = { user: { name: '', email: '' }, list: [] }



export default class UserCrud extends Component {
    state = { ...initialState }

    componentDidMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ user: initialState.user })
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl

        axios[method](url, user).then(resp => {
            // Pegar os dados retornados pelo json server (no caso o usuário)
            const list = this.getUpdatedList(resp.data)
            this.setState({ user: initialState.user, list })
        })
    }

    getUpdatedList(user, add= true) {
        // Criar uma lista sem o user (no caso de ser um put. Caso seja post vai tecnicamente ignorar)
        const list = this.state.list.filter(u => u.id !== user.id)
        // Agora vamos adiocionar o user na primeira posição da lista
        if(add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control" name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>

                    <div className="col-12 md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control" name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o E-mail..." />
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
                        onClick={()     => this.clear()}>
                            Cancelar
                        </button>
                    </div>
                </div>
                <hr />
            </div>
        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then( resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th className="text-center px-4">ID</th>
                        <th className="text-center px-4" >Nome</th>
                        <th className="text-center px-4" >E-mail</th>
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
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td className="text-center px-4" >{user.id}</td>
                    <td className="text-center px-4" >{user.name}</td>
                    <td className="text-center px-4" >{user.email}</td>
                    <td className="text-center px-4" >
                        <button className="btn btn-warning m-1"
                        onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"/>
                        </button>
                        <button className="btn btn-danger m-1"
                        onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"/>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps} >
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}
const { response } = require("express");

  function renderTable() {
    const tableBody = document.querySelector('#product-table tbody');
    tableBody.innerHTML = '';

    axios.get('/products')
    .then(response => {
      const products = response.data

      products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product._id}</td>
          <td>${product.productName}</td>
          <td>${product.productDescription}</td>
          <td>${product.productPrice}</td>
          <td>
            <button class="button-edit" onclick="editProduct('${product._id}')">Editar</button>
            <button class="button-delete" onclick="deleteProduct('${product._id}')">Deletar</button>
          </td>
        `;
        tableBody.appendChild(row);
    })
    
    });
  }

   function renderSearch(searchResults) {
      const tableBody = document.querySelector('#product-table tbody');
  tableBody.innerHTML = '';

    searchResults.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product._id}</td>
      <td>${product.productName}</td>
      <td>${product.productDescription}</td>
      <td>${product.productPrice}</td>
      <td>
        <button class="button-edit" onclick="editProduct('${product._id}')">Editar</button>
        <button class="button-delete" onclick="deleteProduct('${product._id}')">Deletar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  }


 
  


  function searchProduct() {
    const searchTerm = document.getElementById('search').value.toLowerCase();

    if (searchTerm != ''){

      axios.get(`/products/search?name=${searchTerm}`)
      .then(response => {
        renderSearch(response.data)
      })
      .catch(error => {
        console.error('Error: searching products: ', error)
      })
    } else {
      renderTable()
    }
  }
    
    function createProduct() {
      const newProductName = document.getElementById('newProductName').value;
      const newProductDescription = document.getElementById('newProductDescription').value;
      const newProductPrice = parseFloat(document.getElementById('newProductPrice').value);
      if (newProductName != '' && newProductDescription != '' && newProductPrice > 0) {

          newProduct = {
            productName: newProductName.toLowerCase(),
            productDescription: newProductDescription,
            productPrice: newProductPrice,
          };

          axios.post('/products', newProduct)
          .then(response => {
            if (response.status === 201){
              renderTable(newProduct)
              clearCreateForm()

            }
          })
          
          .catch(error => {
              console.error('Error creating product: ', error)
            })
  } else {
      console.log('erro')
  }
    
  }

  function editProduct(productId) {
    axios.put(`/products/${String(productId)}`)
    .then(response => {

    })
  }

  function deleteProduct(productId) {
    axios.delete(`/products/${String(productId)}`)
    .then(response => {
        if(response.status === 204){
          alert('Produto deletado com sucesso')
          renderTable()

        } else if (response.data.status === 404){
          alert('produto não encontrado.')
        }
    })
    .catch(error => {
      if (error.response && error.response.status === 500) {
        console.error('Erro interno no servidor ao deletar produto', error);
        alert('Erro interno ao deletar produto');
      } else if (error.response && error.response.status === 404) {
        console.error('Produto não encontrado', error);
        alert('Produto não encontrado');
      } else {
        console.error('Erro ao deletar produto', error);
        alert('Erro ao deletar produto');
      }
    })
    
  }

  function clearCreateForm() {
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductDescription').value = '';
    document.getElementById('newProductPrice').value = '';
  }

  function openCreatePopup() {
    document.getElementById('popup').style.display = 'block';
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  } 

  // Inicializa a tabela com os dados existentes
  renderTable();
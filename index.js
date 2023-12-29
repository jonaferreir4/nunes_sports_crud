
$(document).ready(function() {
    $("#productForm").submit(function(event) {
      event.preventDefault();
  
      const method = $(this).attr("method");
  
      const formData = {
        productName: $("#productName").val(),
        productCode: $("#productCode").val(),
        productDescription: $("#productDescription").val(),
        productPrice: $("#productPrice").val()
      };
  
      if (method === "GET") {
        axios.get('/products')
          .then(response => {
            console.log('Produtos:', response.data);
          })
          .catch(error => console.error('Erro ao obter produtos:', error));
      } else if (method === "POST") {
        axios.post('/products', formData)
          .then(response => {
            console.log('Produto enviado:', response.data);
          })
          .catch(error => console.error('Erro ao enviar produto:', error));
      }
    });
  });
  
var cidades = [], marcas = [];

function editar(obj){

    $("#cidades").html("");
    $("#marcas").html("");
    $("#update").val(true);
    
    for(var i = 0; i < cidades.length;i++){
        if(cidades[i].cod_cidade == obj.cidade){
            $("#cidades").append(`
                <option selected value=${cidades[i].cod_cidade}>${cidades[i].nome_cidade}</option>
            `);        
        }else{
            $("#cidades").append(`
                <option value=${cidades[i].cod_cidade}>${cidades[i].nome_cidade}</option>
            `);   
        }
    }

    for(var i = 0; i < marcas.length;i++){
        if(marcas[i].cod_marca == obj.marca_produto){
            $("#marcas").append(`
                <option selected value=${marcas[i].cod_marca}>${marcas[i].nome_marca}</option>
            `);        
        }else{
            $("#marcas").append(`
                <option value=${marcas[i].cod_marca}>${marcas[i].nome_marca}</option>
            `);   
        }
    }

    $("#codigo").val(obj.cod_produto).attr("readonly",true);
    $("#nome").val(obj.nome_produto);
    $("#valor").val(obj.valor);
    $("#estoque").val(obj.estoque);

    $("#lista-produto").hide();
    $("#form-produto").show();   
    

}   


function deletar(obj){

    if(!obj.estoque || obj.estoque == 0 || obj.estoque == 0.00){
        alert("Este produto não pode ser deletado pois está sem estoque.");
        return;
    }

    var sureDel = confirm("Deseja realmente deletar este item ?");

    if(sureDel){

        url = "http://127.0.0.1:8001/api/delete-produto/"+obj.cod_produto;

        $.ajax({
            url:url,
            dataType:"json",
            type:"DELETE",
            success:function(data){
            if(!data){
                alert("Não foi possível deletar o produto");
                return;
            }

            var base = "http://127.0.0.1:8001/api/";

            var url = base + "listar-produtos"; 

            $("#tableProdutos").html("");
    
                $.ajax({
                    url:url,
                    dataType:"json",
                    success:function(data){
                        if(!data.length){
                            return;
                        }
                        var total = 0 , cont = 0;
                        for(var i = 0; i < data.length;i++){

                            total += data[i].valor;
                            cont++;
                            
                            $("#tableProdutos").append(`
                                <tr>
                                    <td>${data[i].cod_produto}</td>
                                    <td>${data[i].nome_produto}</td>
                                    <td>${data[i].valor}</td>
                                    <td>${data[i].nome_cidade}</td>
                                    <td>${data[i].nome_marca}</td>
                                    <td>${data[i].estoque}</td>
                                    <td><button class="btn btn-sm btn-outline-primary" onclick='editar(${JSON.stringify(data[i])})' type="button">editar</button></td>
                                    <td><button class="btn btn-sm btn-outline-danger" onclick='deletar(${JSON.stringify(data[i])})' type="button">deletar</button></td>
                                    
                                </tr>
                            `);
                        }

                    $("#total").text('Total R$ '+String(total.toFixed(2)).replace(".",","));
                    $("#media").text('Média R$ '+String((total/cont).toFixed(2)).replace(".",","));
                    
                },error:function(error){
                        console.log(error);
                    }
                
                });


            },error:function(error){
                console.log(error);
            }
        });
    }

}

$(function(){

    setTimeout(() => {
        $(".loading").hide();   
    }, 1000);

    $("#form-produto").hide();

    var base = "http://127.0.0.1:8001/api/";

    function listarCidades(){

        $("#cidades").html("");

        var url = base + "cidades"; 

        $.ajax({
            url:url,
            dataType:"json",
            success:function(data){
                console.log(data);
                if(!data.length){
                    alert("Houve um erro ao tentar recuperar as cidades.");
                    return;
                }
    
                cidades = data;
    
                for(var i = 0; i < data.length;i++){
                    $("#cidades").append(`
                        <option value=${data[i].cod_cidade}>${data[i].nome_cidade}</option>
                    `);          
                 
                }
            },error:function(error){
                console.log(error);
            }
        });

    }


    function listarProdutos(){

        var url = base + "listar-produtos"; 

        $("#tableProdutos").html("");

        $.ajax({
            url:url,
            dataType:"json",
            success:function(data){
                if(!data.length){
                    return;
                }
                
                var total = 0;
                var cont = 0;
                for(var i = 0; i < data.length;i++){
                    total += data[i].valor;
                    cont++;
                    $("#tableProdutos").append(`
                        <tr>
                            <td>${data[i].cod_produto}</td>
                            <td>${data[i].nome_produto}</td>
                            <td>${data[i].valor}</td>
                            <td>${data[i].nome_cidade}</td>
                            <td>${data[i].nome_marca}</td>
                            <td>${data[i].estoque}</td>
                            <td><button class="btn btn-sm btn-outline-primary" onclick='editar(${JSON.stringify(data[i])})' type="button">editar</button></td>
                            <td><button class="btn btn-sm btn-outline-danger" onclick='deletar(${JSON.stringify(data[i])})' type="button">deletar</button></td>
                            
                        </tr>
                    `);
                }


                $("#total").text('Total R$ '+String(total.toFixed(2)).replace(".",","));

                $("#media").text('Média R$ '+String((total/cont).toFixed(2)).replace(".",","));

            },error:function(error){
                console.log(error);
            }
        
        });

    }
    function listarMarcas(){

        var url = base + "marcas"; 

        $("#marcas").html("");

        $.ajax({
            url:url,
            dataType:"json",
            success:function(data){
                if(!data.length){
                    alert("Houve um erro ao tentar recuperar as marcas.");
                    return;
                }
                marcas = data;
                for(var i = 0; i < data.length;i++){
                    $("#marcas").append(`
                        <option value=${data[i].cod_marca}>${data[i].nome_marca}</option>
                    `);          
                 
                }
            },error:function(error){
                console.log(error);
            }
        
        });

    }

    listarCidades();    
    listarProdutos();  
    listarMarcas();  

   $("#novoProduto").click(function(){
     $("#update").val();
     $("#codigo").val("");
     $("#nome").val("");
     $("#valor").val("");
     $("#estoque").val("");
     listarCidades();
     listarMarcas();
     $("#lista-produto").hide();
     $("#form-produto").show();
   }); 

   $("#voltar").click(function(){
    $("#lista-produto").show();
    $("#form-produto").hide();
   });
   

   $("#formProduto").on("submit",function(e){
        
        e.preventDefault();
        
        var isUpdate = $("#update").val();
    
        var objProduto = {
            "cod_produto":parseInt($("#codigo").val()),
            "nome_produto":$("#nome").val(),
            "valor":$("#valor").val(),
            "estoque":$("#estoque").val(),
            "cidade":$("#cidades").val(),
            "marca_produto":parseInt($("#marcas").val())
        }  

        url = "http://127.0.0.1:8001/api/inserir-produto";

        if(isUpdate){
            url = "http://127.0.0.1:8001/api/update-produto/"+ $("#codigo").val();
        }

        $.ajax({
            url:url,
            type:isUpdate ? "PUT" : "POST",
            data:objProduto,
            dataType:"json",
            success:function(data){
                if(!data && isUpdate){
                    alert("Não foi possível atualizar o produto");
                    return;
                }
                listarProdutos();
                $("#form-produto").hide();   
                $("#lista-produto").show();       
            },error:function(error){
                console.log(error);
                if(error.status == 422 && error.responseJSON == "Este produto já está cadastrado nesta cidade."){
                    alert(error.responseJSON);
                    return;
                }else{
                    alert("Um erro ocorreu ao tentar cadastrar ou atulizar o produto " +error.responseJSON.message);
                    return;
                }
               
            }
        
        });

   });

   $("#buscaProduto").keyup(function(){
    
    var produto = $(this).val();

    if(produto.length > 0){

        url = "http://127.0.0.1:8001/api/produto/"+ produto;

        $.ajax({
            url:url,
            type:"GET",
            dataType:"json",
            success:function(data){

                if(!data.length){
                    return;
                }

                $("#tableProdutos").html("");

                var cont = 0,total = 0;

                for(var i = 0; i < data.length;i++){
                    total += data[i].valor;   
                    cont++; 
                    $("#tableProdutos").append(`
                        <tr>
                            <td>${data[i].cod_produto}</td>
                            <td>${data[i].nome_produto}</td>
                            <td>${data[i].valor}</td>
                            <td>${data[i].nome_cidade}</td>
                            <td>${data[i].nome_marca}</td>
                            <td>${data[i].estoque}</td>
                            <td><button class="btn btn-sm btn-outline-primary" onclick='editar(${JSON.stringify(data[i])})' type="button">editar</button></td>
                            <td><button class="btn btn-sm btn-outline-danger" onclick='deletar(${JSON.stringify(data[i])})' type="button">deletar</button></td>
                            
                        </tr>
                    `);



                $("#total").text('Total R$ '+String(total.toFixed(2)).replace(".",","));
                $("#media").text('Média R$ '+String((total/cont).toFixed(2)).replace(".",","));

                }
                   
            },error:function(error){
                console.log(error);
               
            }
        
        });   

    }

   });

});
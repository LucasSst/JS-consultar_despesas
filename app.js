class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getId() {
        let id = localStorage.getItem('id')
        return parseInt(id)
    }

    getNextId() {
        let nextId = this.getId()
        return (parseInt(nextId) + 1)
    }

    recordLocalStore(e) {
        let id = this.getNextId()
        localStorage.setItem(id, JSON.stringify(e))
        localStorage.setItem('id', id)
    }

    allRecords() {
        let expenses = Array()
        let id = this.getId()
        for (let i = 1; i <= id; i++) {
            let expense = JSON.parse(localStorage.getItem(i))

            if (expense === null) {
                continue
            }
            expense.id= i
            expenses.push(expense)

        }
        return (expenses)
    }

    search(expenses, indiction = false){
        let expensesFilter = Array()
        expensesFilter = this.allRecords()

        if(indiction = false){
            //years
            if(expenses.ano != ""){
                expensesFilter = expensesFilter.filter(e => e.ano == expenses.ano) 
            
            }
            
            //month
            if(expenses.mes != ""){
                expensesFilter = expensesFilter.filter(e => e.mes == expenses.mes) 
            }

            //day
            if(expenses.dia != ""){
                expensesFilter = expensesFilter.filter(e => e.dia == expenses.dia) 
            
            }

            //type
            if(expenses.tipo != ""){
                expensesFilter = expensesFilter.filter(e => e.tipo == expenses.tipo) 
            
            }

            //description
            if(expenses.descricao != ""){
                expensesFilter = expensesFilter.filter(e => e.descricao == expenses.descricao) 
            
            }

            //value
            if(expenses.valor != ""){
                expensesFilter = expensesFilter.filter(e => e.valor == expenses.valor) 
            
            }
        }

        //indiction
        if(indiction = true){
            //years
            if(expenses.ano != ""){
                expensesFilter = expensesFilter.filter(e => e.ano == expenses.ano) 
            
            }
            
            //month
            if(expenses.mes != ""){
                expensesFilter = expensesFilter.filter(e => e.mes == expenses.mes) 
            }

            //day
            if(expenses.dia != ""){
                expensesFilter = expensesFilter.filter(e => e.dia == expenses.dia) 
            
            }

            //type
            if(expenses.tipo != ""){
                expensesFilter = expensesFilter.filter(e => e.tipo == expenses.tipo) 
                
            }

        }
        return expensesFilter
    }
    

    deleteExpenses(id){
        localStorage.removeItem(id)
    }

   
}


class Expenses {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    handleCheck() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }

        }
        return true
    }
}

let bd = new Bd

function registerExpenses() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let expenses = new Expenses(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    let modal = document.getElementById('modal_conteudo')
    let headerColor = document.getElementById('modal-header')
    let button = document.getElementById('modal-button')
    let h5 = document.getElementById("exampleModalLabel")

    if (expenses.handleCheck()) {
        bd.recordLocalStore(expenses)
        $('#modal').modal('show')
        headerColor.className = "modal-header text-success"
        modal.innerHTML = "Despesa foi cadastrada com sucesso!"
        h5.innerHTML = 'Registro inserido com sucesso'
        button.innerHTML = 'Voltar'
        button.className = "btn btn-success"

        ano.value = ""
        mes.value = ""
        dia.value = ""
        tipo.value= ""
        descricao.value = ""
        valor.value = ""

    } else {
        $('#modal').modal('show')
        headerColor.className = "modal-header text-danger"
        modal.innerHTML = "Existem campos obrigatorios que não foram preenchidos"
        button.innerHTML = 'Voltar e corrigir'
        h5.innerHTML = 'Erro na gravação'
        button.className = "btn btn-danger"
    }

}

function modalExpensesDelete(){
    $('#modal').modal('show')
    let modal = document.getElementById('modal_conteudo')
    let headerColor = document.getElementById('modal-header')
    let button = document.getElementById('modal-button')
    let h5 = document.getElementById("exampleModalLabel")

    

    headerColor.className = "modal-header text-success"
    modal.innerHTML = "Parabéns!Os Itens foram excluídos"
    button.innerHTML = 'Voltar'
    h5.innerHTML = 'Sucesso'
    button.className = "btn btn-success"
    button.onclick = function(){
        window.location.reload()
    }
        
    
}

function loadingExpensesList(expenses = Array(), filtro = false, Btn= true, sum=false) {
    
    if(expenses.length == 0 && filtro == false){
        expenses = bd.allRecords()
    }

    let expenseList = document.getElementById('expensesList')
    expenseList.innerHTML= ''
    
    
    expenses.forEach((e) => {
        let row = expenseList.insertRow()
        row.insertCell(0).innerHTML = `${e.dia}/${e.mes}/${e.ano}`
        switch (e.tipo) {
            case "1": e.tipo = "Alimentação"
                break
            case "2": e.tipo = "Educação"
                break
            case "3": e.tipo = "Lazer"
                break
            case "4": e.tipo = "Saúde"
                break
            case "5": e.tipo = "Transporte"
                break
        }
        
        row.insertCell(1).innerHTML= e.tipo
        row.insertCell(2).innerHTML= e.descricao
        row.insertCell(3).innerHTML= e.valor
        
        if(Btn == true) {
            let btn = document.createElement("button")
            btn.className= 'btn btn-danger'
            btn.innerHTML= '<i class="fas fa-times"></i>'
            btn.id = `id_expenses_${e.id}`
            btn.onclick = function (){
                let id = btn.id.replace('id_expenses_', '')
                bd.deleteExpenses(id)
                modalExpensesDelete()
                
                
            }
            row.insertCell(4).append(btn)
        }
    })
    
    if(Btn == false){
        let row = expenseList.insertRow()

        if (sum == false){
            let valueExpenses = sumAll(expenses)
            row.insertCell(0).innerHTML = ""
            row.insertCell(1).innerHTML = ""
            row.insertCell(2).innerHTML = "Valor Total"
            row.insertCell(3).innerHTML = valueExpenses.toFixed(2)
        }else {
            let valueExpenses = sumAll(expenses)
            row.insertCell(0).innerHTML = ""
            row.insertCell(1).innerHTML = ""
            row.insertCell(2).innerHTML = "Valor Total"
            row.insertCell(3).innerHTML = valueExpenses.toFixed(2)
        }
        
       
    }
}
function searchExpenses(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    let expense = new Expenses (ano,mes,dia,tipo,descricao,valor)
    
    
    let expenses = bd.search(expense)
    loadingExpensesList(expenses)


}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
//INDICTIONS
//////////////////////////////////////////////////////



function searchExpensesIndiction(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let expense = new Expenses (ano,mes,dia,tipo)
    
    
    let expenses = bd.search(expense, true)

    loadingExpensesList(expenses, filtro = true, Btn= false, sum=true)
}

function sumAll(expenses){
    let sumGlobal = 0

    expenses.forEach((e) => {
        let value = parseFloat(e.valor)
        sumGlobal +=  value
            
    })
    return sumGlobal
}
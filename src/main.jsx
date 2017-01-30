require("./style.css");
import React from 'react';
import {render} from 'react-dom';
import store from './ItemsStore.jsx'
import PersonItem from './ItemComponent.jsx';
const onPage = 10
const customStyles = {
  overlay : {
    position          : 'fixed', 
    backgroundColor   : 'rgba(255, 255, 255, 0.75)',
    backgroundColor   : 'rgba(55, 55, 55, 0.6)',
    'overflow-y'      : 'hidden'
  },
  content : {
    top                   : '50%',
    left                  : '50%', 
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    'overflow-y'      : 'hidden'
  }
};

class App extends React.Component {
  constructor() { 
    super();
    this.state = {
        'wait': store.getAll(),
         newIsOpen : false,
         showPage: 0
    };


    this._onChange = this._onChange.bind(this);
    this.onAddRecord = this.onAddRecord.bind(this);
    this.setPage = this.setPage.bind(this)
    
  } 
  
  setPage(n) {
    this.setState( { 'showPage' : parseInt(n)})
    console.log({'set Page': n})
    // Store in cookies
    document.cookie="PageN="+n+";";
  }

  componentDidMount() {
    
    var cookiePage = document.cookie.replace(/(?:(?:^|.*;\s*)PageN\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (cookiePage) {
      this.setPage(cookiePage)
    }
    
    store.addChangeListener(this._onChange);
    window.addEventListener('storage', function(e){ store.onStorageChange(e)} );
}

  componentWillUnmount() {
    store.removeChangeListener(this._onChange);
    window.removeEventListener('storage', function(e){ store.onStorageChange(e)}, false);
  }
  
  _onChange() { 
    console.log({"_onChange" : store.getAll()})
    this.setState({      
        'wait': store.getAll()
        }); 
  }

  onAddRecord(count) {  
        let attr = {}
        attr.name = '...'
        attr.age = ''
        attr.phone = ''
        attr.email = ''
        attr.gmt=0
        store.createcount(attr, count)
    }
    

  render () {
    let items = this.state.wait.slice(this.state.showPage * onPage, this.state.showPage * onPage + onPage); 
    let totalPages =  Math.floor( this.state.wait.length / onPage )  + (this.state.wait.length % onPage ? 1 : 0)
    let PersonItems = [];
    items.forEach(function (item, index, array) {
              PersonItems.push( <PersonItem 
                                attr  = {item}
                                index = {index}
                                key = {index}
                                />
                            );
    }) 
    return <div className="panels">
    <h2>Persons list</h2>
    <nav aria-label="Page navigation">
  <ul className="pagination">
    <li>
      <a href="#" onClick={ (e)=>{ this.setPage(Math.max(0, this.state.showPage - 1 )) }} aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li><a href="#" >Page {this.state.showPage + 1 } of {totalPages }</a></li>
    <li>
      <a href="#" aria-label="Next" onClick={ (e)=>{ this.setPage(Math.min(totalPages, this.state.showPage + 1 )) }} >
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
    <table className="table table-striped table-hover"> 
      <thead>
       <tr>
        <th>Имя Фамилия<br/> client time</th>
        <th>Примечание</th> 
        <th>Телефон</th>
        <th className="col-md-2" >Дата</th>
        <th className="col-sm-2" >Время</th>
        <th className="col-sm-1" >GMT offset</th>
        <th className="col-sm-1" >isActive</th>
        <th></th>
        </tr>
      </thead>
      <tbody> 
      {PersonItems}
      </tbody> 
    </table>
           <div className="clear"></div>
    <form> 
    <button onClick ={()=>{this.onAddRecord(1)}} type="button" className="btn btn-default" aria-label="Left Align">
  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Record
</button>
    <button onClick ={()=>{this.onAddRecord(100)}} type="button" className="btn btn-default" aria-label="Left Align">
  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add 100 Records
</button>
    </form> 
    </div>; 
  }
}

render(<App/>, document.getElementById('app'));



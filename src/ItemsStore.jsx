import react from 'react';
import {render} from 'react-dom';
import {EventEmitter} from 'events';
var assign = require('object-assign');

/*
 Typical item record

{ 
   id: 
   crated: 
   state: 
   text:
   changed:
}
*/
var CHANGE_EVENT = 'change';

const store = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of items.
   * @return {object}
   */
  getAll: function() {
    var _items = this.getFromStorage();
    var tmpArray = [];
    _items.forEach(function(value){tmpArray.push(value)})
    return tmpArray;
  },

  /**
   * Create new item
   * @param {string} text
   * @return {object}
   */
  create: function(attr) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    if (!( "id" in attr )) {  attr.id = id; }
    if (!('created' in attr)) {  (new Date()).toISOString();};
    attr['changed'] =(new Date()).toISOString();
    this.updateItem(id ,attr);
  },
  
  createcount: function(attrib,count) {
   var  _items =  this.getFromStorage();
    for (var i = 0; i < count; i++) {
      let attr = assign({}, attrib)
      var id = (new Date()+ _items.size + Math.floor(Math.random() * 999999)).toString(36);
      if (!( "id" in attr )) {  attr.id = id; }
      if (!('created' in attr)) {  (new Date()).toISOString();};
      attr['changed'] =(new Date()).toISOString();
     _items.set(id , attr);
    }
   this.setToStorage( _items);
   this.emitChange();
  },
  
  updateItem: function (id, attr) {
     var  _items =  this.getFromStorage();
     _items.set(id , attr);
     this.setToStorage( _items);
    this.emitChange();
  },
 deleteItem: function( id) {
     var  _items =  this.getFromStorage();
     console.log('delete ' + id);
     _items.delete(id);
     this.setToStorage( _items);
     this.emitChange();
    
 },
  getFromStorage: function () {
      var tmpArray = JSON.parse( localStorage.getItem("demo") || '[]' );
      var _items = new Map();
      tmpArray.forEach( function (val) { _items.set(val.id, val)} );
      return _items
  },
 
  setToStorage: function (_items) {
    var tmpArray = [];
    _items.forEach(function(value){tmpArray.push(value)})
    window.localStorage.setItem("demo",JSON.stringify(tmpArray));
  },

  onStorageChange: function (e) {
    this.emitChange();
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }


});
export default store;


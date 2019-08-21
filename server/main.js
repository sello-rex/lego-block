import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Legos } from '../both/collection';

Meteor.methods({ 
  addLego: function(opt){
    check(opt, Object);
    
    return Legos.insert(opt);
  },
  removeLego: function(id){
    check(id, String);
    
    return Legos.remove({_id: id});
  }
});

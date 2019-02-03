#include "hello-storage.hpp"
using namespace eosio;

ACTION advanced_storage::hi( name user, string full_name ) {
   require_auth(user);
   print_f( "Hello % from hello", user );
   addName(user, full_name);
}

ACTION advanced_storage::forget(name user) {
   require_auth(user);
   removeName(user, full_name);
   print_f("User has been removed");
}

EOSIO_DISPATCH( advanced_storage, (hi)(forget) )

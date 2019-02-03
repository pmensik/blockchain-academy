#include "hello-storage.hpp"
using namespace eosio;

ACTION hello_storage::hi( name user, string full_name ) {
   require_auth(user);
   print_f( "Hello % from hello", user );
   addName(user, full_name);
}

EOSIO_DISPATCH( hello_storage, (hi) )

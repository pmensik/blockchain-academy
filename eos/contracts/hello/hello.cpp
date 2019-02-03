#include "hello.hpp"
using namespace eosio;

ACTION hello::hi( name user ) {
   require_auth(user);
   print_f( "Hello % from hello", user );
}

EOSIO_DISPATCH( hello, (hi) )

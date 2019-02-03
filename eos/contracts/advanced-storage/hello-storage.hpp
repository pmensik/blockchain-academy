#include <eosiolib/eosio.hpp>

using namespace eosio;
using std::string;

CONTRACT advanced_storage : public eosio::contract {
  public:
      using contract::contract;

      ACTION hi(name user, string full_name);
      ACTION forget(name user);

      // accessor for external contracts to easily send inline actions to your contract
      using hi_action = action_wrapper<"hi"_n, &hello_storage::hi>;

  private:
      TABLE entry {
          name user;
          string full_name;
          uint64_t lastUpdate;

          uint64_t primary_key()const {
              return user;
          }
      };
      typedef multi_index<N(advanced_history), entry> history_index;

      void addName(name user, string full_name) {
          history_index history(_self, _self);
          auto iterator = history.find(user);
          if(iterator == history.end()) {
              history.emplace(user, [&](auto& row) {
                  row.user = user;
                  row.full_name = full_name;
                  row.lastUpdate = now();
              });
          } else {
              history.modify(iterator, user, [&](auto& row) {
                  row.user = user;
                  row.full_name = full_name;
                  row.lastUpdate = now();
              });
          }
      }

      void removeName(name user) {
          history_index history(_self, _self);
          auto iterator = history.find(user);
          eosio_assert(iterator != history.end(), "User does not exist");
          history.erase(iterator);
      }
};

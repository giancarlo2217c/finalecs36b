#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <iostream>

#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/json.hpp>

#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>

// for Json::value
#include <json/json.h>
#include <json/reader.h>
#include <json/writer.h>
#include <json/value.h>

int myParseJSON(std::string input, Json::Value * jv_ptr);

int main(int, char**) {
    mongocxx::instance inst{};
    mongocxx::uri uri("mongodb://localhost:27017");
    mongocxx::client client(uri);

    bsoncxx::builder::stream::document document{};
    mongocxx::database db = client["tweetsDB"];
    mongocxx::collection coll = db["tweets"];

    // collection.insert_one(document.view());
    auto cursor = coll.find({});

    std::vector<std::string> * tweets = new std::vector<std::string>();

        for (auto&& doc : cursor) {
            // std::cout << bsoncxx::to_json(doc) << std::endl;
            std::string tweet =  bsoncxx::to_json(doc);
            Json::Value * Jtweet = new Json::Value();
            myParseJSON(tweet, Jtweet);
            std::string text = (*Jtweet)["text"].toStyledString();
            std::cout << text << std::endl;
            
            std::ofstream outfile;
            outfile.open("../analizer/tweets.csv", std::ios::app );
            outfile << text + ",";

        }
}

int myParseJSON (std::string input, Json::Value * jv_ptr) {

  std::cout << "parsing" << std::endl;
  if (jv_ptr == NULL) return -1;

  Json::CharReaderBuilder builder;
  Json::CharReader* reader;
  std::string errors;
  bool parsingSuccessful;

  reader = builder.newCharReader();
  parsingSuccessful = reader->parse(input.c_str(),
				    input.c_str() + input.size(),
				    jv_ptr, &errors);
  delete reader;

  if (!parsingSuccessful) {
    std::cout << "Failed to parse the content of the first JSON, errors:" << std::endl;
    std::cout << errors << std::endl;
    return -1;
  }


  return 1;
}
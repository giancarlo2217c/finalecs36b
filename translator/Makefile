CC = g++ -std=c++14

CFLAGS = -g -I/usr/include/jsoncpp

LDFLAGS = -ljsoncpp -lmicrohttpd -ljsonrpccpp-common -ljsonrpccpp-server -lcurl -ljsonrpccpp-client



all: test

test.o: test.cpp 
	$(CC) -c -I/usr/local/include/mongocxx/v_noabi -I/usr/local/include/libmongoc-1.0 -I/usr/local/include/bsoncxx/v_noabi -I/usr/local/include/libbson-1.0 -L/usr/local/lib test.cpp

test: test.o
	$(CC) -o test test.o  -lmongocxx -lbsoncxx -ljsoncpp -lmicrohttpd -ljsonrpccpp-common -ljsonrpccpp-server -lcurl -ljsonrpccpp-client

clean:
	rm -f *.o *~ test 
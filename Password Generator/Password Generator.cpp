#include <iostream>
#include <string>
#include "cryptlib.h"
#include <fstream>

std::string random_string( size_t length )
{
    auto randchar = []() -> char
    {
        const char charset[] =
        "0123456789"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz";
        const size_t max_index = (sizeof(charset) - 1);
        return charset[ rand() % max_index ];
    };
    std::string str(length,0);
    std::generate_n( str.begin(), length, randchar );
    return str;
}

int main(){
    while(true){
    std::string serviceInput;
    std::cout<<"Service: ";
    std::cin>>serviceInput;
    srand((unsigned)time(NULL) * getpid()); 
    std::string randomAlphanumericString = random_string(16);
    std::cout<<"Password for " + serviceInput + ": " + randomAlphanumericString << std::endl;
    std::fstream file;
    std::cout<<"Recording..." << std::endl;
    file.open("Passwords.txt", std::ios::out | std::ios::app);
    file << serviceInput + ": " + randomAlphanumericString << std::endl;
    file.close();
    std::cout<<"Recorded" << std::endl;
    }
}
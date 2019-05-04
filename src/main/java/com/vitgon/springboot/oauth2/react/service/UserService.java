package com.vitgon.springboot.oauth2.react.service;

import java.util.List;

import com.vitgon.springboot.oauth2.react.model.User;

public interface UserService {

    User save(User user);
    List<User> findAll();
    void delete(long id);
}

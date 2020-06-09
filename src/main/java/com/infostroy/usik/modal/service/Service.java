package com.infostroy.usik.modal.service;

import com.infostroy.usik.modal.entity.Entity;

import java.util.List;
import java.util.Optional;

public interface Service<T extends Entity> {

    T save(T entity);

    List<T> listAll();

    Optional<T> get(Long id);

    void delete(Long id);
}

package com.infostroy.usik.modal.service;

import com.infostroy.usik.modal.entity.Student;
import com.infostroy.usik.modal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@Transactional
public class StudentService implements Service<Student> {

    @Autowired
    private StudentRepository repository;

    @Override
    public Student save(Student student) {
        return repository.save(student);
    }

    @Override
    public List<Student> listAll() {
        return (List<Student>) repository.findAll();
    }

    @Override
    public Optional<Student> get(Long id) {
        return repository.findById(id);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Optional<Student> findByName(String name) {
        return repository.findByName(name);
    }

}

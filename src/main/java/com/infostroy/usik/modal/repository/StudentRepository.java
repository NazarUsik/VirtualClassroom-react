package com.infostroy.usik.modal.repository;

import com.infostroy.usik.modal.entity.Student;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends CrudRepository<Student, Long> {
    Optional<Student> findByName(@Param("name") String name);
}

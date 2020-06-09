package com.infostroy.usik.controller;

import com.infostroy.usik.modal.entity.Student;
import com.infostroy.usik.modal.service.StudentService;
import com.infostroy.usik.utils.StoredAttributeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class StudentController {

    private final Logger log = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService service;

    @PostMapping("/login")
    public ResponseEntity<Student> doLogin(HttpServletResponse response, @RequestParam(defaultValue = "") String username) {
        username = username.trim();

        Optional<Student> student = service.findByName(username);

        if (!student.isPresent()) {
            student = Optional.ofNullable((service.save(new Student(username))));
            log.info("Student don't exist, created new: {}", student);
        } else {
            log.info("Student exist: {}", student);
        }

        Student stud = student.orElse(null);

        if (stud != null) {
            StoredAttributeUtils.storeInCookie(response, "student_id", String.valueOf(stud.getId()));
            StoredAttributeUtils.storeInCookie(response, "student_name", stud.getName());
        }

        return ResponseEntity.ok().body(stud);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> doLogout(HttpServletResponse response, HttpServletRequest request) {
        log.info("Request to logout Students");
        request.getSession().invalidate();
        StoredAttributeUtils.deleteUserCookie(response, "student_id");
        StoredAttributeUtils.deleteUserCookie(response, "student_name");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/students")
    public ResponseEntity<?> students() {
        List<Student> result = service.listAll();
        log.info("Request to read Students: {}", result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {
        Optional<Student> student = service.get(id);
        log.info("Request to read Student: {}", student);
        Student st = student.orElse(null);
        return st == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : ResponseEntity.ok().body(st);
    }

    @PostMapping("/student")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) throws URISyntaxException {
        log.info("Request to create Student: {}", student);
        Student result = service.save(student);
        return ResponseEntity.created(new URI("/api/student/" + result.getId()))
                .body(result);
    }

    @PutMapping("/student/{id}")
    public ResponseEntity<Student> updateStudent(@RequestBody Student Student) {
        log.info("Request to update Student: {}", Student);
        Student result = service.save(Student);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/student/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        log.info("Request to delete Student: {}", id);
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
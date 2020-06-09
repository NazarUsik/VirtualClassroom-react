package com.infostroy.usik.controller;

import com.infostroy.usik.modal.entity.Student;
import com.infostroy.usik.modal.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

    @RestController
public class HomeController {

    private final Logger log = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService service;

    @RequestMapping("/")
    public ModelAndView index() {
        log.info("Index");
        return new ModelAndView("index");
    }

    @RequestMapping(path = "/login", method = RequestMethod.GET)
    public ModelAndView showLoginPage() {
        return new ModelAndView("login");
    }

    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public ModelAndView doLogin(HttpServletRequest request, @RequestParam(defaultValue = "") String username) {
        username = username.trim();

        if (username.isEmpty()) {
            return new ModelAndView("login");
        }

        if (!service.findByName(username).isPresent()) {
            service.save(new Student(username));
        }

        request.getSession().setAttribute("username", username);

        return new ModelAndView("redirect:/");
    }
}

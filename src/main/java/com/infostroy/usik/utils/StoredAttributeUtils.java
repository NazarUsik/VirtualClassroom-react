package com.infostroy.usik.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

public class StoredAttributeUtils {

    public static void storeInCookie(HttpServletResponse response, String cookieName, String attribute) {
        Cookie cookie = new Cookie(cookieName, attribute);
        cookie.setMaxAge(7 * 24 * 60 * 60);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    public static void deleteUserCookie(HttpServletResponse response, String cookieName) {
        Cookie cookieUserName = new Cookie(cookieName, null);
        cookieUserName.setMaxAge(0);
        response.addCookie(cookieUserName);
    }

}

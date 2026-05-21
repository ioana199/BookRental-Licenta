package com.bookrental.app.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import org.hibernate.annotations.OptimisticLock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalControllerAdvice {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException e) {
        return ResponseEntity.status(404).body(ErrorResponse.create(e, HttpStatus.NOT_FOUND, e.getMessage()));
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ErrorResponse> handleObjectOptimisticLockingFailureException(ObjectOptimisticLockingFailureException e) {
        return ResponseEntity.status(409).body(ErrorResponse.create(e, HttpStatus.CONFLICT, e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<String> errors = new ArrayList<>();

        e.getBindingResult()
                .getAllErrors()
                .forEach((error) -> {
                    String errorMessage = error.getDefaultMessage();
                    errors.add(errorMessage);
                });

        return ResponseEntity.status(400).body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        String message = "A apărut o eroare neprevazuta pe server...";

        return ResponseEntity.status(500).body(ErrorResponse.create(e, HttpStatus.INTERNAL_SERVER_ERROR, message));
    }


}

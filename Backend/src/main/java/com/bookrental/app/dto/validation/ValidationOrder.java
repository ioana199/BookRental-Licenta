package com.bookrental.app.dto.validation;

import jakarta.validation.GroupSequence;

@GroupSequence({BasicValidation.class, DateValidation.class})
public interface ValidationOrder {
}

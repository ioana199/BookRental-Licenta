package com.bookrental.app.enums;

public enum StatusReservation {
    PENDING {
        @Override
        public boolean isNextStatePossible(StatusReservation nextState) {
            return nextState == IN_PROGRESS;
        }
    },
    IN_PROGRESS {
        @Override
        public boolean isNextStatePossible(StatusReservation nextState) {
            return nextState == FINISHED || nextState == DELAYED;
        }
    },
    DELAYED {
        @Override
        public boolean isNextStatePossible(StatusReservation nextState) {
            return false;
        }
    },
    FINISHED {
        @Override
        public boolean isNextStatePossible(StatusReservation nextState) {return false;}
    },
    CANCELED {
        @Override
        public boolean isNextStatePossible(StatusReservation nextState) {return false;}
    };

    public abstract boolean isNextStatePossible(StatusReservation nextState);
}

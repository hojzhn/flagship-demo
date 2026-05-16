import { createContext, useContext, useReducer } from "react";
import { SEED_STANDINGS, SEED_DIRECT_HOLDINGS } from "./Seed.js";

// State shape
//   standings        array of standing records
//   directHoldings   array of direct holding records
//
// Actions
//   BACK_THEME       create a new standing for the given basketId at the
//                    given monthly level. Initial currentValue is the
//                    level (one month's contribution). The action name
//                    matches the UI label ("Back this theme") even
//                    though standings are mechanically tied to a basket.
//   ADJUST_LEVEL     change the level on an existing standing
//   PAUSE            mark a standing as paused
//   RESUME           mark a paused standing as active again
//   RETRACT          remove a standing entirely
//   RESET            return state to seed values
//
// The reducer is the only place state changes. Components dispatch
// actions and read derived values via the hook.

const initialState = {
  standings: SEED_STANDINGS,
  directHoldings: SEED_DIRECT_HOLDINGS,
};

function reducer(state, action) {
  switch (action.type) {
    case "BACK_THEME": {
      const { basketId, level, standingId } = action;
      const newStanding = {
        id: standingId,
        basketId,
        level,
        startedAt: new Date().toISOString().slice(0, 10),
        currentValue: level,
        status: "active",
      };
      return { ...state, standings: [...state.standings, newStanding] };
    }

    case "ADJUST_LEVEL": {
      const { standingId, level } = action;
      return {
        ...state,
        standings: state.standings.map((s) =>
          s.id === standingId ? { ...s, level } : s,
        ),
      };
    }

    case "PAUSE": {
      const { standingId } = action;
      return {
        ...state,
        standings: state.standings.map((s) =>
          s.id === standingId ? { ...s, status: "paused" } : s,
        ),
      };
    }

    case "RESUME": {
      const { standingId } = action;
      return {
        ...state,
        standings: state.standings.map((s) =>
          s.id === standingId ? { ...s, status: "active" } : s,
        ),
      };
    }

    case "RETRACT": {
      const { standingId } = action;
      return {
        ...state,
        standings: state.standings.filter((s) => s.id !== standingId),
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

const StandingsContext = createContext(null);

export function StandingsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StandingsContext.Provider value={{ state, dispatch }}>
      {children}
    </StandingsContext.Provider>
  );
}

export function useStandings() {
  const ctx = useContext(StandingsContext);
  if (!ctx) {
    throw new Error("useStandings must be used inside StandingsProvider");
  }
  return ctx;
}

// Convenience action creators so components do not have to construct
// action objects by hand.
export const actions = {
  backTheme: (basketId, level) => ({
    type: "BACK_THEME",
    basketId,
    level,
    // Generated in the action creator (not the reducer) so callers can
    // navigate to the new standing's detail page after dispatching.
    standingId: `std-${basketId}-${Date.now()}`,
  }),
  adjustLevel: (standingId, level) => ({
    type: "ADJUST_LEVEL",
    standingId,
    level,
  }),
  pause: (standingId) => ({ type: "PAUSE", standingId }),
  resume: (standingId) => ({ type: "RESUME", standingId }),
  retract: (standingId) => ({ type: "RETRACT", standingId }),
  reset: () => ({ type: "RESET" }),
};

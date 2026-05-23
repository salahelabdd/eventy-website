/**
 * pricingUtils.js  —  server/utils/pricingUtils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All multiplier logic reads from the venue document — nothing is hardcoded.
 * The frontend mirrors getGuestTier() and getEventTypeMultiplier() inline
 * using the venue data it already receives from the API.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Returns the matching guest-tier bracket from venue.guestTierPricing.
 * Brackets are sorted ascending by min so the first match wins.
 *
 * @param {Array}  guestTierPricing  — venue.guestTierPricing (array of bracket objects)
 * @param {number} guests
 * @returns {{ min, max, multiplier, label }}
 */
const getGuestTier = (guestTierPricing, guests) => {
  const n = Number(guests) || 0;
  const tiers = [...(guestTierPricing || [])].sort((a, b) => a.min - b.min);
  const match = tiers.find((t) => n >= t.min && n <= t.max);
  return (
    match ||
    tiers[tiers.length - 1] || {
      min: 0,
      max: 999999,
      multiplier: 1.0,
      label: "",
    }
  );
};

/**
 * Returns the event-type multiplier from venue.eventTypePricing.
 * Handles both a Mongoose Map and a plain serialised object.
 *
 * @param {Map|object} eventTypePricing
 * @param {string}     eventType
 * @returns {number}
 */
const getEventTypeMultiplier = (eventTypePricing, eventType) => {
  if (!eventTypePricing || !eventType) return 1.0;
  const val =
    eventTypePricing instanceof Map
      ? eventTypePricing.get(eventType)
      : eventTypePricing[eventType];
  return Number(val) || 1.0;
};

/**
 * Full price calculation — called by bookingController.js.
 * Both multipliers come from the venue document; nothing is hardcoded here.
 *
 * @param {object} params
 * @param {number}     params.pricePerHour
 * @param {number}     params.hours
 * @param {number}     params.guestCount
 * @param {string}     params.eventType
 * @param {Map|object} params.eventTypePricing   — venue.eventTypePricing
 * @param {Array}      params.guestTierPricing   — venue.guestTierPricing
 * @param {Array}      params.serviceObjects     — [{ price: number }, …]
 */
const calculateTotal = ({
  pricePerHour,
  hours,
  guestCount,
  eventType,
  eventTypePricing,
  guestTierPricing,
  serviceObjects = [],
}) => {
  const hourlyRate = (Number(pricePerHour) || 0) * 10;
  const baseCost = (Number(hours) || 1) * hourlyRate;

  const eventMultiplier = getEventTypeMultiplier(eventTypePricing, eventType);
  const guestTier = getGuestTier(guestTierPricing, guestCount);
  const guestMultiplier = guestTier.multiplier;

  const adjustedVenueCost = Math.round(
    baseCost * eventMultiplier * guestMultiplier,
  );
  const servicesTotal = serviceObjects.reduce(
    (s, svc) => s + (Number(svc.price) || 0),
    0,
  );
  const total = adjustedVenueCost + servicesTotal;

  return {
    baseCost,
    eventMultiplier,
    guestMultiplier,
    guestTierLabel: guestTier.label,
    adjustedVenueCost,
    servicesTotal,
    total,
  };
};

module.exports = { getGuestTier, getEventTypeMultiplier, calculateTotal };

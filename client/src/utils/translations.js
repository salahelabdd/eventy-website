const translations = {
  en: {
    // ── Navbar
    venues: "Venues",
    accommodation: "Accommodation",
    services: "Services",
    about: "About",
    adminDashboard: "Admin Dashboard",
    providerDashboard: "Provider Dashboard",
    myReservation: "My Reservation",
    profile: "Profile",
    logout: "Logout",
    signIn: "Sign In",

    // ── Hero
    heroEyebrow: "Luxury Event Planning",
    heroTitle1: "Where every",
    heroTitle2: "moment becomes",
    heroTitleEm: "legend.",
    heroSub:
      "Discover extraordinary venues for weddings, conferences, celebrations, and experiences that leave a lasting impression.",
    statVenues: "Premium Venues",
    statAvailable: "Available Now",
    statSatisfaction: "Satisfaction",

    // ── Filters
    filterByEventType: "Filter by Event Type",
    filterByLocation: "Filter by Location",
    filterByAvailability: "Filter by Availability",
    allLocations: "All Locations",
    searchVenues: "Search venues…",
    searchHotels: "Search hotels…",
    filterByType: "Filter by Type",

    // ── Availability options
    all: "All",
    available: "Available",
    unavailable: "Unavailable",

    // ── Venues section
    curatedSelection: "Curated Selection",
    allVenues: "All Venues",
    venuesListed: (n) => `${n} venue${n !== 1 ? "s" : ""} listed`,
    noVenuesFound: "No venues found",
    noVenuesSub: "Try a different category or check back soon.",
    bookNow: "Book Now",
    signInToBook: "Sign In to Book",
    markUnavailable: "✖ Mark Unavailable",
    markAvailable: "✔ Mark Available",
    removeVenue: "✕ Remove Venue",
    showMore: (n) => `Show More — ${n} remaining`,
    addVenue: "Add Venue",
    capacity: "Capacity",
    guests: "guests",
    pricePerHour: "Price / Hour",

    // ── Accommodation section
    accommodationDivider: "Accommodation",
    curatedStays: "Curated Stays",
    allAccommodations: "All Accommodations",
    propertiesListed: (n) => `${n} propert${n !== 1 ? "ies" : "y"} listed`,
    noAccomFound: "No accommodations found",
    noAccomSub: "Try a different type or check back soon.",
    bookStay: "Book Stay",
    addHotel: "Add Hotel",
    removeHotel: "✕ Remove Hotel",
    moreAmenities: (n) => `+${n} more`,
    perNight: "Per Night",
    rating: "Rating",

    // ── Venue modal
    removeVenueTitle: "Remove Venue",
    removeVenueWarning: "? This action cannot be undone.",
    yesRemove: "Yes, Remove",
    cancel: "Cancel",
    addNewVenue: "Add New Venue",
    venueNameLabel: "Venue Name *",
    venueNamePlaceholder: "Grand Ballroom",
    locationLabel: "Location *",
    locationPlaceholder: "Cairo, Egypt",
    capacityLabel: "Capacity *",
    capacityPlaceholder: "500",
    priceHourLabel: "Price / Hour *",
    priceHourPlaceholder: "200",
    eventTypeLabel: "Event Type *",
    selectType: "— Select type —",
    descriptionLabel: "Description",
    descVenuePlaceholder: "Describe the venue…",
    imageUrlsLabel: "Image URLs (comma-separated)",
    imageUrlsPlaceholder: "https://…, https://…",
    availableImmediately: "Available immediately",
    addVenueBtn: "Add Venue",
    addingBtn: "Adding…",

    // ── Hotel modal
    removeHotelTitle: "Remove Hotel",
    addNewHotel: "Add New Hotel",
    hotelNameLabel: "Hotel Name *",
    hotelNamePlaceholder: "The Grand Palace",
    hotelTypeLabel: "Type *",
    starRatingLabel: "Star Rating *",
    priceNightLabel: "Price Per Night (USD) *",
    priceNightPlaceholder: "350",
    descHotelPlaceholder: "Describe the property…",
    amenitiesLabel: "Amenities (comma-separated)",
    amenitiesPlaceholder: "Pool, Spa, Free WiFi, Gym",
    addHotelBtn: "Add Hotel",

    // ── Footer
    footerRights: "All rights reserved.",
    footerSub: "Luxury Event Planning Platform",
  },

  ar: {
    // ── Navbar
    venues: "القاعات",
    accommodation: "الإقامة",
    services: "الخدمات",
    about: "من نحن",
    adminDashboard: "لوحة الإدارة",
    providerDashboard: "لوحة المزود",
    myReservation: "حجوزاتي",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    signIn: "تسجيل الدخول",

    // ── Hero
    heroEyebrow: "تخطيط الفعاليات الفاخرة",
    heroTitle1: "حيث يصبح كل",
    heroTitle2: "لحظة",
    heroTitleEm: "أسطورة.",
    heroSub:
      "اكتشف قاعات استثنائية للأعراس والمؤتمرات والاحتفالات والتجارب التي تترك انطباعاً لا يُنسى.",
    statVenues: "قاعة مميزة",
    statAvailable: "متاح الآن",
    statSatisfaction: "رضا العملاء",

    // ── Filters
    filterByEventType: "تصفية حسب نوع الفعالية",
    filterByLocation: "تصفية حسب الموقع",
    filterByAvailability: "تصفية حسب التوفر",
    allLocations: "جميع المواقع",
    searchVenues: "ابحث عن قاعة…",
    searchHotels: "ابحث عن فندق…",
    filterByType: "تصفية حسب النوع",

    // ── Availability options
    all: "الكل",
    available: "متاح",
    unavailable: "غير متاح",

    // ── Venues section
    curatedSelection: "تشكيلة مختارة",
    allVenues: "جميع القاعات",
    venuesListed: (n) => `${n} قاعة مدرجة`,
    noVenuesFound: "لا توجد قاعات",
    noVenuesSub: "جرّب فئة مختلفة أو عد لاحقاً.",
    bookNow: "احجز الآن",
    signInToBook: "سجّل للحجز",
    markUnavailable: "✖ تعيين كغير متاح",
    markAvailable: "✔ تعيين كمتاح",
    removeVenue: "✕ حذف القاعة",
    showMore: (n) => `عرض المزيد — ${n} متبقية`,
    addVenue: "إضافة قاعة",
    capacity: "السعة",
    guests: "ضيف",
    pricePerHour: "السعر / ساعة",

    // ── Accommodation section
    accommodationDivider: "الإقامة",
    curatedStays: "إقامات مختارة",
    allAccommodations: "جميع أماكن الإقامة",
    propertiesListed: (n) => `${n} عقار مدرج`,
    noAccomFound: "لا توجد أماكن إقامة",
    noAccomSub: "جرّب نوعاً مختلفاً أو عد لاحقاً.",
    bookStay: "احجز إقامة",
    addHotel: "إضافة فندق",
    removeHotel: "✕ حذف الفندق",
    moreAmenities: (n) => `+${n} أكثر`,
    perNight: "لليلة الواحدة",
    rating: "التقييم",

    // ── Venue modal
    removeVenueTitle: "حذف القاعة",
    removeVenueWarning: "؟ لا يمكن التراجع عن هذا الإجراء.",
    yesRemove: "نعم، احذف",
    cancel: "إلغاء",
    addNewVenue: "إضافة قاعة جديدة",
    venueNameLabel: "اسم القاعة *",
    venueNamePlaceholder: "قاعة الكبرى",
    locationLabel: "الموقع *",
    locationPlaceholder: "القاهرة، مصر",
    capacityLabel: "السعة *",
    capacityPlaceholder: "500",
    priceHourLabel: "السعر / ساعة *",
    priceHourPlaceholder: "200",
    eventTypeLabel: "نوع الفعالية *",
    selectType: "— اختر النوع —",
    descriptionLabel: "الوصف",
    descVenuePlaceholder: "صف القاعة…",
    imageUrlsLabel: "روابط الصور (مفصولة بفواصل)",
    imageUrlsPlaceholder: "https://…, https://…",
    availableImmediately: "متاح فوراً",
    addVenueBtn: "إضافة قاعة",
    addingBtn: "جارٍ الإضافة…",

    // ── Hotel modal
    removeHotelTitle: "حذف الفندق",
    addNewHotel: "إضافة فندق جديد",
    hotelNameLabel: "اسم الفندق *",
    hotelNamePlaceholder: "قصر الفخامة",
    hotelTypeLabel: "النوع *",
    starRatingLabel: "تصنيف النجوم *",
    priceNightLabel: "السعر لليلة الواحدة (دولار) *",
    priceNightPlaceholder: "350",
    descHotelPlaceholder: "صف العقار…",
    amenitiesLabel: "المرافق (مفصولة بفواصل)",
    amenitiesPlaceholder: "مسبح، سبا، واي فاي مجاني، صالة رياضية",
    addHotelBtn: "إضافة فندق",

    // ── Footer
    footerRights: "جميع الحقوق محفوظة.",
    footerSub: "منصة تخطيط الفعاليات الفاخرة",
  },
};

// Event type labels per language
export const EVENT_TYPE_LABELS = {
  en: {
    all: "All Venues", wedding: "Wedding", birthday: "Birthday",
    prom: "Prom", graduation: "Graduation", engagement: "Engagement",
    anniversary: "Anniversary", conference: "Conference", business: "Business",
    concert: "Concert", corporate: "Corporate", exhibition: "Exhibition",
    gala: "Gala", other: "Other",
  },
  ar: {
    all: "جميع القاعات", wedding: "زفاف", birthday: "عيد ميلاد",
    prom: "حفلة التخرج", graduation: "تخرج", engagement: "خطوبة",
    anniversary: "ذكرى سنوية", conference: "مؤتمر", business: "أعمال",
    concert: "حفلة موسيقية", corporate: "شركات", exhibition: "معرض",
    gala: "حفل رسمي", other: "أخرى",
  },
};

// Hotel type labels per language
export const HOTEL_TYPE_LABELS = {
  en: {
    all: "All", hotel: "Hotel", resort: "Resort",
    villa: "Villa", chalet: "Chalet", suite: "Suite", hostel: "Hostel",
  },
  ar: {
    all: "الكل", hotel: "فندق", resort: "منتجع",
    villa: "فيلا", chalet: "شاليه", suite: "جناح", hostel: "نزل",
  },
};

export default translations;
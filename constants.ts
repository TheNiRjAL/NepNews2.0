import { Candidate, HoroscopeSign, HotTopic, NewsItem, TranslationDictionary } from './types';

export const DICTIONARY: TranslationDictionary = {
  appTitle: { np: 'नेप-न्युज', en: 'NepNews' },
  home: { np: 'गृहपृष्ठ', en: 'Home' },
  election: { np: 'उम्मेदवारहरू', en: 'Candidates' },
  news: { np: 'पार्टी समाचार', en: 'Party News' }, // Changed to Party News
  horoscope: { np: 'राशिफल', en: 'Horoscope' },
  calendar: { np: 'पात्रो', en: 'Calendar' },
  admin: { np: 'एडमिन', en: 'Admin' },
  searchPlaceholder: { np: 'जिल्ला, नगरपालिका वा उम्मेदवार खोज्नुहोस्...', en: 'Search district, municipality or candidate...' },
  breakingNews: { np: 'ताजा खबर', en: 'Breaking News' },
  readMore: { np: 'पुरा पढ्नुहोस्', en: 'Read More' },
  candidateSearch: { np: 'उम्मेदवार खोजी', en: 'Candidate Search' },
  district: { np: 'जिल्ला', en: 'District' },
  municipality: { np: 'पालिका', en: 'Municipality' },
  ward: { np: 'वडा नं', en: 'Ward No' },
  search: { np: 'खोज्नुहोस्', en: 'Search' },
  votes: { np: 'प्राप्त मत', en: 'Votes' },
  todayHoroscope: { np: 'आजको राशिफल', en: "Today's Horoscope" },
  nepaliMonth: { np: 'बैशाख २०८१', en: 'Baisakh 2081' },
  login: { np: 'लग - इन', en: 'Login' },
  password: { np: 'पासवर्ड', en: 'Password' },
  hotTopic: { np: 'तातो विषय', en: 'Hot Topic' },
  close: { np: 'बन्द गर्नुहोस्', en: 'Close' },
  loading: { np: 'लोड हुँदैछ...', en: 'Loading...' },
  noResults: { np: 'कुनै नतिजा भेटिएन', en: 'No results found' },
  refreshing: { np: 'ताजा गर्दै...', en: 'Refreshing...' },
  updated: { np: 'अपडेट गरिएको:', en: 'Updated:' },
  quickLinks: { np: 'छिटो पहुँच', en: 'Quick Links' },
  dashboard: { np: 'ड्यासत्रोर्ड', en: 'Dashboard' },
  candidatesTitle: { np: 'निर्वाचन उम्मेदवारहरू', en: 'Election Candidates' },
  age: { np: 'उमेर', en: 'Age' },
  education: { np: 'शिक्षा', en: 'Education' },
  bio: { np: 'परिचय', en: 'Biography' },
  manifesto: { np: 'प्रतिवद्धता पत्र', en: 'Manifesto' }
};

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'बालेन शाह',
    party: 'स्वतन्त्र',
    position: 'मेयर',
    district: 'काठमाडौं',
    municipality: 'काठमाडौं महानगरपालिका',
    ward: 0,
    votes: 61767,
    imageUrl: 'https://picsum.photos/200/200?random=1',
    symbolUrl: 'https://picsum.photos/50/50?random=101',
    age: 33,
    education: 'Structural Engineering (Masters)',
    bio: 'युवा पुस्ताका लोकप्रिय स्वतन्त्र उम्मेदवार। काठमाडौंको फोहोर व्यवस्थापन र पूर्वाधार विकासमा नयाँ सोचका साथ अघि बढेका छन्।',
    manifesto: '१. घर-घरमा फोहोर व्यवस्थापन\n२. डिजिटल काठमाडौं\n३. नेवारी सम्पदाको संरक्षण\n४. शिक्षा र स्वास्थ्यमा सुधार'
  },
  {
    id: '2',
    name: 'केशव स्थापित',
    party: 'नेकपा एमाले',
    position: 'मेयर',
    district: 'काठमाडौं',
    municipality: 'काठमाडौं महानगरपालिका',
    ward: 0,
    votes: 38117,
    imageUrl: 'https://picsum.photos/200/200?random=2',
    symbolUrl: 'https://picsum.photos/50/50?random=102',
    age: 63,
    education: 'Bachelor in Arts',
    bio: 'काठमाडौंका पूर्व मेयर र अनुभवी राजनीतिज्ञ। "मेरो पौरख, मेरो गौरव" भन्ने नाराका साथ पुनः मैदानमा।',
    manifesto: '१. काठमाडौंलाई स्मार्ट सिटी बनाउने\n२. वृद्धभत्ता बढाउने\n३. रात्रिकालीन व्यवसाय प्रवर्द्धन'
  },
  {
    id: '3',
    name: 'सिर्जना सिंह',
    party: 'नेपाली कांग्रेस',
    position: 'मेयर',
    district: 'काठमाडौं',
    municipality: 'काठमाडौं महानगरपालिका',
    ward: 0,
    votes: 21234,
    imageUrl: 'https://picsum.photos/200/200?random=3',
    symbolUrl: 'https://picsum.photos/50/50?random=103',
    age: 58,
    education: 'Bachelor in Political Science',
    bio: 'लामो समयदेखि महिला अधिकार र सामाजिक सेवामा सक्रिय। गणेशमान सिंहको परिवारबाट राजनीतिमा।',
    manifesto: '१. महिला सशक्तिकरण\n२. सुरक्षित काठमाडौं\n३. वातावरण संरक्षण'
  },
  {
    id: '4',
    name: 'हर्क साम्पाङ',
    party: 'स्वतन्त्र',
    position: 'मेयर',
    district: 'सुनसरी',
    municipality: 'धरान उपमहानगरपालिका',
    ward: 0,
    votes: 20821,
    imageUrl: 'https://picsum.photos/200/200?random=4',
    symbolUrl: 'https://picsum.photos/50/50?random=104',
    age: 42,
    education: 'Bachelor in English',
    bio: 'धरानको खानेपानी समस्या समाधानका लागि लामो समयदेखि आन्दोलनरत अभियन्ता।',
    manifesto: '१. धरानमा खानेपानीको समाधान\n२. भ्रष्टाचार मुक्त नगरपालिका\n३. श्रमदान संस्कृति'
  },
  {
    id: '5',
    name: 'गोपी हमाल',
    party: 'स्वतन्त्र',
    position: 'मेयर',
    district: 'कैलाली',
    municipality: 'धनगढी उपमहानगरपालिका',
    ward: 0,
    votes: 26000,
    imageUrl: 'https://picsum.photos/200/200?random=5',
    symbolUrl: 'https://picsum.photos/50/50?random=105',
    age: 52,
    education: 'Masters in Business',
    bio: 'धनगढीका सफल व्यवसायी र समाजसेवी। "हाम्रो धनगढी, राम्रो धनगढी" अभियानका नेतृत्वकर्ता।',
    manifesto: '१. नमुना धनगढी\n२. बाढी डुबानको स्थायी समाधान\n३. खेलकुद विकास'
  },
  {
    id: '6',
    name: 'रेणु दाहाल',
    party: 'माओवादी केन्द्र',
    position: 'मेयर',
    district: 'चितवन',
    municipality: 'भरतपुर महानगरपालिका',
    ward: 0,
    votes: 52028,
    imageUrl: 'https://picsum.photos/200/200?random=6',
    symbolUrl: 'https://picsum.photos/50/50?random=106',
    age: 46,
    education: 'Bachelor Degree',
    bio: 'भरतपुरको विकास र समृद्धिको लागि दोस्रो कार्यकालका लागि उम्मेदवार।',
    manifesto: '१. स्मार्ट भरतपुर\n२. अन्तर्राष्ट्रिय क्रिकेट रंगशाला\n३. रिङरोड निर्माण'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'निर्वाचन परिणाम लाइभ: काठमाडौंमा बालेनको अग्रता कायमै',
    description: 'पछिल्लो मतगणना अनुसार काठमाडौं महानगरपालिकामा स्वतन्त्र उम्मेदवार बालेन शाहले आफ्ना प्रतिस्पर्धीहरू भन्दा उल्लेख्य मतान्तरले अग्रता लिइरहेका छन्।',
    source: 'कान्तिपुर',
    imageUrl: 'https://picsum.photos/800/400?random=10',
    publishedAt: new Date().toISOString(), // Just Now
    category: 'election',
    url: 'https://ekantipur.com/'
  },
  {
    id: '2',
    title: 'देशभरको मौसममा बदली, केही स्थानमा भारी वर्षा',
    description: 'मौसम पूर्वानुमान महाशाखाका अनुसार आज दिउँसो देशका पहाडी भू-भागमा मेघ गर्जनसहित वर्षाको सम्भावना रहेको छ।',
    source: 'अनलाइन खबर',
    imageUrl: 'https://picsum.photos/800/400?random=11',
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    category: 'national',
    url: 'https://www.onlinekhabar.com/'
  },
  {
    id: '3',
    title: 'नेपाल राष्ट्र बैंकद्वारा नयाँ मौद्रिक नीति सार्वजनिक',
    description: 'आर्थिक स्थिरता कायम गर्न र मुद्रास्फीति नियन्त्रण गर्न राष्ट्र बैंकले कडा मौद्रिक नीति अख्तियार गरेको छ।',
    source: 'सेतोपाटी',
    imageUrl: '',
    publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    category: 'national',
    url: 'https://www.setopati.com/'
  },
  {
    id: '4',
    title: 'सीमा नाकाहरूमा सुरक्षा व्यवस्था कडा',
    description: 'चाडपर्वको समयमा हुने आवतजावतलाई व्यवस्थित गर्न र सुरक्षा चुनौती कम गर्न सीमा नाकाहरूमा विशेष निगरानी बढाइएको छ।',
    source: 'हिमालयन टाइम्स',
    imageUrl: '',
    publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    category: 'national',
    url: 'https://thehimalayantimes.com/'
  },
  {
    id: '5',
    title: 'प्रमुख शहरहरूमा फोहोर व्यवस्थापनको समस्या',
    description: 'काठमाडौं उपत्यका लगायतका प्रमुख शहरहरूमा फोहोर नउठ्दा जनजीवन प्रभावित बनेको छ।',
    source: 'रातोपाटी',
    imageUrl: '',
    publishedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    category: 'politics',
    url: 'https://ratopati.com/'
  },
  {
    id: '6',
    title: 'शैक्षिक सत्र २०८१ को भर्ना अभियान सुरु',
    description: 'सरकारले "सबै बालबालिकालाई विद्यालय पठाऔं" भन्ने नाराका साथ नयाँ शैक्षिक सत्रको भर्ना अभियान सुरु गरेको छ।',
    source: 'गोरखापत्र',
    imageUrl: '',
    publishedAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    category: 'national',
    url: 'https://gorkhapatraonline.com/'
  },
  {
    id: '7',
    title: 'नेपाली क्रिकेट टोलीको उत्कृष्ट प्रदर्शन',
    description: 'अन्तर्राष्ट्रिय प्रतियोगितामा नेपाली खेलाडीहरूले उत्कृष्ट ब्याटिङ र बलिङको नमुना प्रस्तुत गरेका छन्।',
    source: 'खेलकुद खबर',
    imageUrl: '',
    publishedAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    category: 'national',
    url: 'https://www.mfd.gov.np/'
  },
  {
    id: '8',
    title: 'पर्यटन क्षेत्रमा उत्साहजनक सुधार',
    description: 'कोरोना महामारीपछि नेपाल आउने विदेशी पर्यटकहरूको संख्यामा उल्लेख्य वृद्धि भएको पर्यटन बोर्डले जनाएको छ।',
    source: 'नागरिक',
    imageUrl: '',
    publishedAt: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
    category: 'national',
    url: 'https://nagariknews.nagariknetwork.com/'
  }
];

export const MOCK_RASHIFAL: HoroscopeSign[] = [
  { id: 'mesh', nepaliName: 'मेष', englishName: 'Aries', prediction: 'आजको दिन उत्साहपूर्ण रहनेछ। नयाँ कार्यको थालनी हुनेछ।', luckyColor: 'रातो', luckyNumber: 9, icon: '♈' },
  { id: 'brish', nepaliName: 'वृष', englishName: 'Taurus', prediction: 'आर्थिक लाभ हुने योग छ। बोलीको प्रभाव बढ्नेछ।', luckyColor: 'सेतो', luckyNumber: 6, icon: '♉' },
  { id: 'mithun', nepaliName: 'मिथुन', englishName: 'Gemini', prediction: 'लामो यात्राको अवसर मिल्नेछ। साथीभाइको सहयोग पाइनेछ।', luckyColor: 'हरियो', luckyNumber: 5, icon: '♊' },
  { id: 'karkat', nepaliName: 'कर्कट', englishName: 'Cancer', prediction: 'स्वास्थ्यमा क्रमिक सुधार आउनेछ। मन प्रसन्न रहनेछ।', luckyColor: 'पहेँलो', luckyNumber: 2, icon: '♋' },
  { id: 'simha', nepaliName: 'सिंह', englishName: 'Leo', prediction: 'सामाजिक मान-सम्मान पाइनेछ। नेतृत्व क्षमता वृद्धि हुनेछ।', luckyColor: 'सुन्तला', luckyNumber: 1, icon: '♌' },
  { id: 'kanya', nepaliName: 'कन्या', englishName: 'Virgo', prediction: 'विद्या र बुद्धिको विकास हुनेछ। परीक्षामा सफलता मिल्नेछ।', luckyColor: 'निलो', luckyNumber: 5, icon: '♍' },
  { id: 'tula', nepaliName: 'तुला', englishName: 'Libra', prediction: 'व्यापार व्यवसायमा मनग्य लाभ हुनेछ। दाम्पत्य जीवन सुखमय रहनेछ।', luckyColor: 'सेतो', luckyNumber: 6, icon: '♎' },
  { id: 'brishchik', nepaliName: 'वृश्चिक', englishName: 'Scorpio', prediction: 'शत्रुहरू परास्त हुनेछन्। रोकिएका काम बन्नेछन्।', luckyColor: 'रातो', luckyNumber: 9, icon: '♏' },
  { id: 'dhanu', nepaliName: 'धनु', englishName: 'Sagittarius', prediction: 'धार्मिक कार्यमा रुचि बढ्नेछ। परोपकारमा मन जानेछ।', luckyColor: 'पहेँलो', luckyNumber: 3, icon: '♐' },
  { id: 'makar', nepaliName: 'मकर', englishName: 'Capricorn', prediction: 'कर्मको उचित प्रतिफल पाइनेछ। बुवाको सहयोग मिल्नेछ।', luckyColor: 'कालो', luckyNumber: 8, icon: '♑' },
  { id: 'kumbha', nepaliName: 'कुम्भ', englishName: 'Aquarius', prediction: 'नयाँ साथीभाइ बन्नेछन्। रमाइलो भेटघाट हुनेछ।', luckyColor: 'आकाशी', luckyNumber: 8, icon: '♒' },
  { id: 'min', nepaliName: 'मीन', englishName: 'Pisces', prediction: 'खर्च बढ्ने सम्भावना छ। स्वास्थ्यमा ध्यान दिनुहोला।', luckyColor: 'पहेँलो', luckyNumber: 3, icon: '♓' },
];

export const MOCK_HOT_TOPICS: HotTopic[] = [
  {
    id: 'hot_election',
    title: 'निर्वाचन परिणाम अपडेट',
    description: 'पछिल्लो मतपरिणाम अनुसार प्रमुख शहरहरूमा स्वतन्त्र उम्मेदवारहरूको अग्रता कायमै छ। पूर्ण विवरणको लागि हेर्दै रहनुहोस्।',
    isActive: true
  },
  {
    id: 'hot_weather',
    title: 'मौसम पूर्व-सूचना',
    description: 'आगामी ३ दिनसम्म देशका अधिकांश स्थानमा हल्का देखि मध्यम वर्षाको सम्भावना रहेको छ। यात्रा गर्दा सतर्क रहनुहोला।',
    isActive: true
  },
  {
    id: 'hot_sports',
    title: 'खेलकुद अपडेट',
    description: 'नेपाली राष्ट्रिय टोलीले अन्तर्राष्ट्रिय प्रतियोगितामा ऐतिहासिक सफलता हासिल गरेको छ।',
    isActive: true
  },
  {
    id: 'hot_traffic',
    title: 'ट्राफिक अपडेट',
    description: 'उपत्यकाका प्रमुख चोकहरूमा सवारी चाप सामान्य रहेको छ। ट्राफिक नियमको पालना गरौं।',
    isActive: true
  }
];
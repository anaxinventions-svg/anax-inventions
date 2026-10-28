import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { 
  FaChevronLeft, FaChevronRight, FaArrowRight,
  FaCode, FaPaintBrush, FaSearch, FaBullhorn, FaShoppingCart, FaTools 
} from 'react-icons/fa';
import NetworkBackground from '../NetworkBackground';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ServicesBanner.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const iconMap = {
  'FaCode': FaCode,
  'FaPaintBrush': FaPaintBrush,
  'FaSearch': FaSearch,
  'FaBullhorn': FaBullhorn,
  'FaShoppingCart': FaShoppingCart,
  'FaTools': FaTools,
};

const ServicesBanner = () => {
  const [services, setServices] = useState([]);
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/banner?_t=${Date.now()}`);
      setServices(res.data.services || []);
    } catch (err) { console.log('Using defaults'); }
    setLoading(false);
  };

  if (loading || services.length === 0) return null;

  return (
    <section className="services-banner">
      <div className="services-bg-wrapper"><NetworkBackground /></div>
      
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        speed={800}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={true}
        navigation={{ prevEl: '.services-banner__nav--prev', nextEl: '.services-banner__nav--next' }}
        pagination={{ clickable: true, el: '.services-banner__pagination' }}
        className="services-banner__swiper"
      >
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon] || FaCode;
          
          return (
            <SwiperSlide 
              key={service._id} 
              className="services-banner__slide"
              onMouseEnter={() => setHoveredSlide(index)}
              onMouseLeave={() => setHoveredSlide(null)}
            >
              <div className="services-banner__slide-inner">
                <div className="services-banner__content-left">
                  <div className="services-banner__mobile-icon">
                    <IconComponent className="services-banner__icon-svg" style={{ color: '#cc7722' }} />
                  </div>
                  <h2 className="services-banner__title">{service.title}</h2>
                  <p className="services-banner__tagline">{service.subtitle}</p>
                  <p className="services-banner__description">{service.description}</p>
                  <a href="/contact" className="services-banner__cta">
                    <span>Explore Service</span>
                    <FaArrowRight className="services-banner__cta-icon" />
                  </a>
                </div>

                <div className="services-banner__image-wrapper">
                  <div className="services-banner__image-box">
                    <img src={service.image} alt={service.title} className="services-banner__image" />
                    <div className={`services-banner__hover-overlay ${hoveredSlide === index ? 'active' : ''}`}>
                      <div className="services-banner__hover-content">
                        <h3 className="services-banner__hover-title">{service.title}</h3>
                        <ul className="services-banner__hover-list">
                          {(service.features || []).map((item, i) => (
                            <li key={i} className="services-banner__hover-item">{item}</li>
                          ))}
                        </ul>
                        <a href="/contact" className="services-banner__hover-cta">
                          <span>Learn More</span>
                          <FaArrowRight className="services-banner__hover-cta-icon" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <button className="services-banner__nav services-banner__nav--prev"><FaChevronLeft /></button>
      <button className="services-banner__nav services-banner__nav--next"><FaChevronRight /></button>
      <div className="services-banner__pagination" />
    </section>
  );
};

export default ServicesBanner;
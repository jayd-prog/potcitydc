import React, { useState } from 'react';
import '../css/FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const processAnswer = (answer) => {
    const phoneRegex = /(\d{3}-\d{3}-\d{4})/g;
    
    return answer.split('\n').map((paragraph, i) => (
      <p key={i}>
        {paragraph.split(phoneRegex).map((part, j) => 
          phoneRegex.test(part) ? (
            <a key={j} href={`tel:${part.replace(/-/g, '')}`} className="phone-link">
              {part}
            </a>
          ) : (
            part
          )
        )}
      </p>
    ));
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place your order online on our website, or by Text/Call at 202-209-9605."
    },
    {
      question: "Where do you deliver?",
      answer: "We deliver within the DC area. If you are outside the DMV area, you can schedule a pick up. For more Info contact us at 202-209-9605."
    },
    {
      question: "Do you offer any deals or specials?",
      answer: "Yes we do have great specials! Check out our deals on the website, or Text us at 202-209-9605 for more detail."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash donations at the time of delivery/pickup."
    },
    {
      question: "Can I make a change to my order after placing it?",
      answer: "Yes, if you need to make changes to your order, just text us your changes at 202-209-9605."
    },
    {
      question: "What's the best way to reach you?",
      answer: "The best way to reach us is by Texting 202-209-9605."
    },
    {
      question: "How does weed gifting work in Washington, DC?",
      answer: "Weed gifting in Washington, DC operates under Initiative 71, which allows adults 21+ to legally possess and gift cannabis products."
    },
    {
      question: "What is 'I-71' Initiative 71?",
      answer: "Initiative 71 is a ballot measure that was approved by Washington, D.C. voters in November 2014, legalizing the possession, cultivation, and gifting of cannabis products for adults aged 21 and older."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="faq-toggle">
                {activeIndex === index ? '-' : '+'}
              </span>
            </div>
            <div className="faq-answer">
              {processAnswer(faq.answer)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
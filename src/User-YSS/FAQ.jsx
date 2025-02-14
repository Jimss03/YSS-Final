import React from 'react'

function FAQ() {
  return (
    <div className="flex flex-col items-center py-10 mt-10">
      {/* Header */}
      <h1 className="text-5xl font-bold mb-8 mt-10 font-cousine">FAQs</h1>

      {/* FAQ Contents */}
      <div className="p-6 w-full max-w-3xl">
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">What is Young Soul Seekers?</p>
          <p className="text-lg">Young Soul Seekers is a Christian clothing brand that promotes faith and inspiration through its apparel.</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">How can I place an order?</p>
          <p className="text-lg">You can place an order through our website by selecting your items, adding them to your cart, and checking out.</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">Do you accept online payments?</p>
          <p className="text-lg">Currently, we do not accept online payments. Orders are finalized through personal contact for payment arrangements.</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">What sizes do you offer?</p>
          <p className="text-lg">We offer a variety of sizes. Please check our Size Chart for detailed measurements.</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">Do you ship nationwide?</p>
          <p className="text-lg">Currently, we do not ship nationwide as we are a small business just starting out. We hope to offer this service in the future.</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">How long does shipping take?</p>
          <p className="text-lg">Shipping usually takes 3-7 business days, depending on your location.</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">Can I return or exchange items?</p>
          <p className="text-lg">Yes, we allow returns and exchanges for defective or incorrect items. Please contact us within 7 days of receiving your order.</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">Do you restock sold-out items?</p>
          <p className="text-lg">Yes, we restock popular designs, but availability may vary. Follow our social media pages for updates.</p>
        </div>
        <div className="mb-6">
          <p className="text-xl font-semibold mb-2 font-cousine">Can I customize my shirt?</p>
          <p className="text-lg">Currently, we do not offer customization, but we may introduce this in the future.</p>
        </div>
        <div>
          <p className="text-xl font-semibold mb-2 font-cousine">How can I contact you for inquiries?</p>
          <p className="text-lg">You can reach us through the Contact section on our website or via email and phone listed there.</p>
        </div>
      </div>
    </div>
  )
}

export default FAQ

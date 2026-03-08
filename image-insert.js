(async () => {
  console.log("🚀 Initializing Rol & Rose Image Updater (Safe Mode)...");

  // 1. Import Firebase Dynamically
  const { initializeApp } = await import(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
  );
  const { getAuth, signInWithEmailAndPassword } = await import(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
  );
  const { getFirestore, collection, writeBatch, getDocs, doc } = await import(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
  );

  // 2. Initialize App
  const app = initializeApp(
    {
      apiKey: "AIzaSyCBUFaTPfpF_MbC-hGFtVUKGdk3zxmrBfk",
      authDomain: "rolandross-7d223.firebaseapp.com",
      projectId: "rolandross-7d223",
      storageBucket: "rolandross-7d223.firebasestorage.app",
      messagingSenderId: "811915815605",
      appId: "1:811915815605:web:56bfa051b4a33afccbecfc",
    },
    "ImageUpdater_" + Date.now(),
  );

  const auth = getAuth(app);
  const db = getFirestore(app);

  // 3. Authenticate
  const email = prompt(
    "Enter Admin Email to authorize Image Update:",
    "admin@rolandross.com",
  );
  if (!email) return console.log("❌ Operation Aborted.");
  const pass = prompt("Enter Admin Password:");
  if (!pass) return console.log("❌ Operation Aborted.");

  console.log("🔐 Authenticating...");
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    console.log("✅ Authenticated Successfully!");
  } catch (e) {
    return console.error(
      "❌ Authentication Failed. Check your password.",
      e.message,
    );
  }

  // 4. The Specific Image Mapping (enName -> Image URL)
  const imageMapping = {
    "Normal Cut":
      "https://www.freepik.com/free-photo/pretty-female-master-doing-professional-make-up-young-woman_9187387.htm#fromView=search&page=1&position=42&uuid=6e5eef63-862e-4dfd-a130-75ef6a4559a3&query=woman+normal+hair+cut",
    "Front Layer/Curtains Bangs":
      "https://images.unsplash.com/photo-1605497788044-5a32c70784f9?q=80&w=800&auto=format&fit=crop",
    "U/V Cut":
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop",
    "Blunt Cut":
      "https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=800&auto=format&fit=crop",
    "Baby Cut":
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
    "Step Layer/Volume Cut":
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop",
    "Long/Short Bob Cut":
      "https://images.unsplash.com/photo-1583195646194-4638a16dbd71?q=80&w=800&auto=format&fit=crop",
    "Butterfly Cut":
      "https://images.unsplash.com/photo-1643912189679-052be1bb3c2b?q=80&w=800&auto=format&fit=crop",
    "Normal Blowdry":
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    "Hair Iron":
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    "Hair Twist & Set":
      "https://images.unsplash.com/photo-1552664687-3c58dfbb5ff2?q=80&w=800&auto=format&fit=crop",
    "Normal Bun":
      "https://images.unsplash.com/photo-1510412852261-042db6096ab6?q=80&w=800&auto=format&fit=crop",
    "Massy Bun":
      "https://images.unsplash.com/photo-1600570779772-520c020583b4?q=80&w=800&auto=format&fit=crop",
    "Out Curl & Front Set":
      "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=800&auto=format&fit=crop",
    "Front Set & Blowdry":
      "https://images.unsplash.com/photo-1596462502278-27bf850338c4?q=80&w=800&auto=format&fit=crop",
    "Regular Rebounding":
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=800&auto=format&fit=crop",
    "Deep Shine Permanent":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Omega Keratin Permanent":
      "https://images.unsplash.com/photo-1501699169021-3759ee435d66?q=80&w=800&auto=format&fit=crop",
    "Brazilian Keratin Permanent":
      "https://images.unsplash.com/photo-1512496015851-a1dc8a477d94?q=80&w=800&auto=format&fit=crop",
    "GlamFreak Special Smooth & Shine":
      "https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=800&auto=format&fit=crop",
    "Hair Botox":
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    "Hair Wash & Dry":
      "https://images.unsplash.com/photo-1519823551278-641362d66ace?q=80&w=800&auto=format&fit=crop",
    "Hot Oil Massage":
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    "Hair Spa":
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    "Hair Protein Treatment":
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop",
    "Hair Keratin Treatment":
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=800&auto=format&fit=crop",
    "Scalp Treatment":
      "https://images.unsplash.com/photo-1519823551278-641362d66ace?q=80&w=800&auto=format&fit=crop",
    "Henna Pack":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Bond Fusion Treatment":
      "https://images.unsplash.com/photo-1605497788044-5a32c70784f9?q=80&w=800&auto=format&fit=crop",
    "Anti-Dandruff Treatment":
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    "Quick Facial":
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    "Herbal Facial":
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    "Glowing Facial":
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop",
    "Advance Bio-Hydraulic Facial":
      "https://images.unsplash.com/photo-1512496015851-a1dc8a477d94?q=80&w=800&auto=format&fit=crop",
    "Hydra Jelly Facial":
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    "Whitening Facial":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Gold Facial":
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    "Fruits Facial":
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
    "High Frequency Facial":
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    "Pearl White Facial":
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop",
    "Aloe Vera/Milk Facial":
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    "Anti-Aging Facial":
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop",
    "Special Bridal Facial":
      "https://images.unsplash.com/photo-1595956553066-ae24bfda6bc8?q=80&w=800&auto=format&fit=crop",
    "Only Face":
      "https://images.unsplash.com/photo-1512496015851-a1dc8a477d94?q=80&w=800&auto=format&fit=crop",
    "Face with Neck":
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    "Face with Neck & Back + Quick Facial":
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    "Fair Polish Full Leg":
      "https://images.unsplash.com/photo-1516975080661-460d3dcc3a8b?q=80&w=800&auto=format&fit=crop",
    "Fair Polish Half Leg":
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    "Fair Polish Full Hand":
      "https://images.unsplash.com/photo-1519014816548-bf5fe459e366?q=80&w=800&auto=format&fit=crop",
    "Only Upper Lip":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Only Back":
      "https://images.unsplash.com/photo-1519823551278-641362d66ace?q=80&w=800&auto=format&fit=crop",
    "Acrylic Extensions (Full Set)":
      "https://images.unsplash.com/photo-1519014816548-bf5fe459e366?q=80&w=800&auto=format&fit=crop",
    "Acrylic Extensions (Refill)":
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
    "Acrylic Extensions (Removal)":
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    "Gel Extensions (Full Set)":
      "https://images.unsplash.com/photo-1519014816548-bf5fe459e366?q=80&w=800&auto=format&fit=crop",
    "Gel Extensions (Removal)":
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
    "Custom Nail Art":
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    "Regular Pedicure":
      "https://images.unsplash.com/photo-1516975080661-460d3dcc3a8b?q=80&w=800&auto=format&fit=crop",
    "Regular Manicure":
      "https://images.unsplash.com/photo-1519014816548-bf5fe459e366?q=80&w=800&auto=format&fit=crop",
    "Herbal Pedicure":
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    "Herbal Manicure":
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
    "Herbal Pedi-Mani":
      "https://images.unsplash.com/photo-1516975080661-460d3dcc3a8b?q=80&w=800&auto=format&fit=crop",
    "Parrafin Pedicure":
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    "Parrafin Manicure":
      "https://images.unsplash.com/photo-1519014816548-bf5fe459e366?q=80&w=800&auto=format&fit=crop",
    "Parrafin Pedi-Mani":
      "https://images.unsplash.com/photo-1516975080661-460d3dcc3a8b?q=80&w=800&auto=format&fit=crop",
    "Our Signature Russian Pedi-Mani":
      "https://images.unsplash.com/photo-1516975080661-460d3dcc3a8b?q=80&w=800&auto=format&fit=crop",
    "Glam Pedicure Manicure":
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
    "French Trip (Both)":
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    "Nail Polish Apply (Both)":
      "https://images.unsplash.com/photo-1519014816548-bf5fe459e366?q=80&w=800&auto=format&fit=crop",
    "Nail Filing (Both)":
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
    "Hot Stone Back Massage":
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    "Hot Stone Foot Massage":
      "https://images.unsplash.com/photo-1516975080661-460d3dcc3a8b?q=80&w=800&auto=format&fit=crop",
    "Standard Party Makeup":
      "https://images.unsplash.com/photo-1512496015851-a1dc8a477d94?q=80&w=800&auto=format&fit=crop",
    "Exclusive Party Makeover":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Bridal (Senior Artist)":
      "https://images.unsplash.com/photo-1595956553066-ae24bfda6bc8?q=80&w=800&auto=format&fit=crop",
    "Signature Bridal":
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
    "Eyebrow Threading":
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    "Forehead Threading":
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    "Upper/Lower Lip":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Chin Threading":
      "https://images.unsplash.com/photo-1512496015851-a1dc8a477d94?q=80&w=800&auto=format&fit=crop",
    "Full Face Threading":
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop",
    "Half Face Threading":
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    "Full Body Wax":
      "https://images.unsplash.com/photo-1519823551278-641362d66ace?q=80&w=800&auto=format&fit=crop",
    "Full Leg Wax":
      "https://images.unsplash.com/photo-1516975080661-460d3dcc3a8b?q=80&w=800&auto=format&fit=crop",
    "Full Hand Wax":
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    "Half Leg Wax":
      "https://images.unsplash.com/photo-1516975080661-460d3dcc3a8b?q=80&w=800&auto=format&fit=crop",
    "Half Hand Wax":
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    "Full Face Wax":
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    "Half Face Wax":
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
    "Bikini Wax":
      "https://images.unsplash.com/photo-1519823551278-641362d66ace?q=80&w=800&auto=format&fit=crop",
    "Underarms Wax":
      "https://images.unsplash.com/photo-1519823551278-641362d66ace?q=80&w=800&auto=format&fit=crop",
    "Upper Lip Wax":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Chin Wax":
      "https://images.unsplash.com/photo-1512496015851-a1dc8a477d94?q=80&w=800&auto=format&fit=crop",
    "Cheek Wax":
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    "Saree Draping":
      "https://images.unsplash.com/photo-1595956553066-ae24bfda6bc8?q=80&w=800&auto=format&fit=crop",
    "Styling Saree":
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
    "Hijab Setting":
      "https://images.unsplash.com/photo-1596462502278-27bf850338c4?q=80&w=800&auto=format&fit=crop",
    "Orna Set":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Eyelash (Own)":
      "https://images.unsplash.com/photo-1512496015851-a1dc8a477d94?q=80&w=800&auto=format&fit=crop",
    "Eyeliner/Lens (Own)":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Hair Extension/Wig":
      "https://images.unsplash.com/photo-1562322140808-4191b12859b3?q=80&w=800&auto=format&fit=crop",
    "Hair Extension & Set":
      "https://images.unsplash.com/photo-1605497788044-5a32c70784f9?q=80&w=800&auto=format&fit=crop",
    "Nose Piercing":
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    "Ear Piercing":
      "https://images.unsplash.com/photo-1596462502278-27bf850338c4?q=80&w=800&auto=format&fit=crop",
  };

  console.log("🔍 Fetching existing vault records...");
  const servicesSnapshot = await getDocs(collection(db, "services"));
  const batch = writeBatch(db);
  let updatedCount = 0;

  // 5. Safely iterate and Update ONLY the image field if a match is found
  servicesSnapshot.forEach((document) => {
    const serviceData = document.data();
    const serviceName = serviceData.enName;

    if (imageMapping[serviceName]) {
      const docRef = doc(db, "services", document.id);

      // ONLY update the image field. Do not touch anything else.
      batch.update(docRef, {
        image: imageMapping[serviceName],
        updatedAt: new Date().toISOString(),
      });

      updatedCount++;
      console.log(`🖼️ Tagged image for: ${serviceName}`);
    }
  });

  if (updatedCount === 0) {
    return console.log("⚠️ No matching services found. Nothing was updated.");
  }

  console.log(`⏳ Committing updates to ${updatedCount} services...`);
  try {
    await batch.commit();
    console.log("🎉 IMAGES SUCCESSFULLY UPDATED!");
    alert(
      `God Mode Safe Update Complete! ${updatedCount} images updated. Refresh Admin Panel to verify.`,
    );
  } catch (error) {
    console.error("❌ Failed to commit updates.", error);
  }
})();

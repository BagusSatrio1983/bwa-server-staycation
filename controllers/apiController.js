const Category = require("../models/Category");
const Item = require("../models/Item");
const Travelers = require("../models/Booking");
const Treasures = require("../models/Activity");
const Bank = require("../models/Bank");
const Member = require("../models/Member");
const Booking = require("../models/Booking");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title country city price unit imageId")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" });

      const travelers = await Travelers.find();
      const treasures = await Treasures.find();
      const cities = await Item.find();

      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title country city isPopular imageId",
          sort: ({sumBooking: -1}),
          perDocumentLimit: 4,
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({
            _id: category[i].itemId[x]._id,
          }).select("_id ");
          item.isPopular = false;
          await item.save();

          if (category[i].itemId[0]._id.toString() === item._id.toString()) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        hero: {
          travelers: travelers.length,
          treasures: treasures.length,
          cities: cities.length,
        },
        mostPicked,
        category,
        testimonial,        
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "featureId", selsect: "_id qty imageUrl" })
        .populate({ path: "activityId", selsect: "_id type imageUrl" })
        .populate({ path: "imageId", selsect: "_id imageUrl" });

      const bank = await Bank.find();

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      // price,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;

    if(!req.file) {
      return res.status(400).json({ message: "Image not found" });
    }

    console.log('console booking page', idItem, duration, bookingStartDate, bookingEndDate);
    
    if(
      idItem === undefined ||
      duration === undefined ||
      // price === undefined ||
      bookingStartDate === undefined ||
      bookingEndDate === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      bankFrom === undefined
    ) {
      return res.status(404).json({ message: "Lengkapi semua field" });
    }
    
    const item = await Item.findOne({_id: idItem});

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.sumBooking += 1;

    await item.save();

    let total = item.price * duration;
    let tax = total * 0.10;

    const invoice = Math.floor(1000000 + Math.random()* 9000000) ;

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber
    });

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: total += tax,
      itemId: {
        _id: item.id,
        title: item.title,
        price: item.price,
        duration: duration
      },
      memberId: member.id,
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankFrom,
        accountHolder: accountHolder
      }
    } 

    const booking = await Booking.create(newBooking);

     res.status(201).json({ message: "Succes Booking", booking });
  },
};

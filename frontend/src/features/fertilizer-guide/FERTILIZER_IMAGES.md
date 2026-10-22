# Fertilizer recommendation images

Place your fertilizer photos in `frontend/public/images/fertilizers/`.
Edit `fertilizerImages.json` in this folder. Each key must exactly match the
`ml_predictions.organic.fertilizer` or `ml_predictions.inorganic.fertilizer`
text returned by the API. Each value is the public image URL, for example:

```json
{
  "organic": {
    "Compost": "/images/fertilizers/compost.jpg"
  },
  "inorganic": {
    "Muriate of Potash (MOP; 60% K2O)": "/images/fertilizers/mop.jpg"
  }
}
```

The cards automatically display the matching photo after a recommendation.
Add multiple exact output names pointing to the same photo when appropriate.
Use photos you own or have permission to use. Unmapped outputs and failed
image loads keep the existing icon without showing a broken image.
Uploaded photos are mapped for matching materials and crop blends. Product bags are illustrative and may show a different formulation. Outputs without a suitable photo retain their icon.

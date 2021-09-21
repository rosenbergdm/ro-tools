# CT Sim

### Quality of tx sim determines accuracy of the entire tx
- fill out sim prior
- **Reproducable** patient sim
- Important parts:
  - limits,
  - positioning
  - immobilization
  - other devices
  - tx type (photons vs electrons, plan type)
  - Contrast
  - respiratory mgmt
  - chemotherapy
  - implanted devices
  - ?verification sim (verification sim = for complicated and breast patients where there is concern about making it through treatment, includes port films, timing)
  - image guidance
  - ?image fusion
  - treatment plan
- Devices to help
  - rolls and wedges (lower back)
  - wedges for arms / shoulders

### Respiratory management
- 4DCT 3D + time (uses 10 phases equally spaced)
- Oversampling images at all positioning
- Types:
  - prospective vs. restrospective
  - Retrospective (patient breathes freely, scan is really slow, anatomy imaged through cycles)
    - images sorted retrosepctively
    - Many 3D CT sets obtained corresponding to a particular breathing phrase
    - Respiratory cycle divided into phases
  - prospective (scan performed at individual breathing cycle scan)
    - Scan only at full exhalation, for example, after viewing the respiratory waveform
- Scans:
  - MIP: maximum intensity projection: reflects the highest value for each pixel
  - MinIP: similar, used for low contrast items
  - 3D helical scan: 'normal' type scan
  - Avg: average value at each pixel (includes scans from each phase)
  - Untagged: the unbinned low-pitch from the raw 4D data sets (includes all scans)
    - review individual phases near diaphragm or chest wall
    - motion blurring
- Shape artifacts reduced by 4DCT
- Issues:
  - Breathing not perfectly periodic
  - How to register?
- How to measure:
  - Varian RPM: measures movement with IR 
  - Philips bellows: measures abdominal excursion
  - Spirometry
- DIBH (have to measure with above techniques)
- if target motion < 1 cm: Patient treated with FB (untagged primary fused to MIP to contour ITV)
- if > 1 cm: use gated technique (previously used abdominal compression)
- **Always ensure patient can tolerate**


# IGRT
- Types:
  - MV: Portal imaging, MVCBCT
    - Tomotherapy can do MV CT, less  soft tissue differentiation, less artifacts from high-Z
    - DRR: Digitally reconstructed radiographs
      - beam's eye viewing
    - EPID: Electronic portal imaging Devices
  - kV: 2D kV pair, 3D CBC, 4D CBCT
    - Uses amorphous silicon detector
    - half-fan = 24 cm 
    - full-fan = 
    - 4D CBCT
- RealTime Tracking
  - orthogonal kV:
    - ExactTrac (BrainLab)
      - Uses IR optical and floor kV imgaing
    - Cyberknife
      - Synchrony is similary to above ExactTrac
      - Continuously uses kV imaging
    - proton
  - Non-ionizing
    - ViewRay
      - Uses low-field MRI real-time Tracking
      - 3 Co-60 sources are used on with individual MLCs
      - Available with Linac now
    - Calypso
      - Implanted coils which create signal
      - tracked by electromagnetic array
  - Surface-guided 
    - AlignRT: 3 pod system using cameras to make structured light projection patterns along the patient
      - Breast DIBH, lung SBRT, BrainLab

### IGRT imaging doses:
- Balance ALARA with effective localization
- Imaging dose not accounted for during planning
- Typical doses:
  - MV (1 pair): 1-5 cGy
  - kV OBI: < 1 cGy
  - kv 3D CBCT: 1-c cGy to soft tissues, 6-29 cGy to bones (size and site dependent)
  - 4D CBCT dose is 2.5 x higher than 3DCBCT 
- Scattered dose higher than primary beam in CT
- CTDI = 2/3 CTDI(surface) + 1/3 CTDI (center)








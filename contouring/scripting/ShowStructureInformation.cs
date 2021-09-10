using System;
using System.Linq;
using System.Text;
using System.Windows;
using System.Collections.Generic;
using VMS.CA.Scripting;

namespace VMS.IRS.Scripting {

  public class Script {

    public Script() {
    }

    public void Execute(ScriptContext context) {
      if (context.Structure == null) {
        MessageBox.Show("No (or more than one) structure is currently selected!");
        return;
      }
      if (context.Structure is PointsStructure) {
        PointsStructure structPoints = (PointsStructure)context.Structure;
        MessageBox.Show(string.Format("Number of points: {0}", structPoints.Points.Count), 
          string.Format("Point structure '{0}'", structPoints.Id));
        return;
      }
      if (context.Structure is VolumetricStructure) {
        VolumetricStructure structVol = (VolumetricStructure)context.Structure;
        VVector extend = _CalculateExtend(structVol);
        MessageBox.Show(
          string.Format("Volume:\t{0} cm^3 = {1} litres\n", (structVol.Volume / 1000).ToString("0.0"), (structVol.Volume / 1000000).ToString("0.000")) +
          string.Format("Extend:\t{0} x {1} x {2} cm (x, y, z, DICOM patient axes)\n", (extend.x * 0.1).ToString("0.00"), (extend.y * 0.1).ToString("0.00"), (extend.z * 0.1).ToString("0.00")) +
          string.Format("Type:\t{0}\n", structVol.StructureType) +
          string.Format("Status:\t{0}\n", structVol.Status),
          string.Format("Volumetric structure '{0}'", structVol.Id));
      }
    }

    // the extend of the volumetric structure is returned in Dicom x,y,z axes
    private static VVector _CalculateExtend(VolumetricStructure structVol) {
      float[] vertices = structVol.TriangleMesh.Vertices;
      int numVertices = vertices.Length / 6; // each vertice is followed by the normal
      float[] min = new float[] { float.MaxValue, float.MaxValue, float.MaxValue };
      float[] max = new float[] { float.MinValue, float.MinValue, float.MinValue };
      for (int i = 0; i < numVertices; i++) {
        int index = i * 6;
        for (int xyz = 0; xyz < 3; xyz++) {
          if (vertices[index + xyz] < min[xyz]) {
            min[xyz] = vertices[index + xyz];
          }
          if (vertices[index + xyz] > max[xyz]) {
            max[xyz] = vertices[index + xyz];
          }
        }
      }
      return new VVector(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
    }
  }

}
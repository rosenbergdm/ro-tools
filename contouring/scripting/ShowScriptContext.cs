using System;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Drawing;
using System.Collections.Generic;
using VMS.CA.Scripting;

namespace VMS.IRS.Scripting
{

    public class Script
    {

        public Script()
        {
        }

        public void Execute(ScriptContext context)
        {
            var propertyGrid = new PropertyGrid();

            var selectedObjectStack = new Stack<object>();
            
            var goToMenuItem = new MenuItem("Go to");
            goToMenuItem.Click += (sender, eventArgs) =>
            {
                if (propertyGrid.SelectedGridItem != null && propertyGrid.SelectedGridItem.Value != null) { 
                    selectedObjectStack.Push(propertyGrid.SelectedObject);
                    propertyGrid.SelectedObject = propertyGrid.SelectedGridItem.Value;
                }
            };

            var goBackMenuItem = new MenuItem("Go back");
            goBackMenuItem.Click += (sender, eventArgs) =>
            {
                if (selectedObjectStack.Count > 0)
                {
                    propertyGrid.SelectedObject = selectedObjectStack.Pop();
                }
            };

            var contextMenu = new ContextMenu(new[] { goToMenuItem, goBackMenuItem });
            contextMenu.Popup += (sender, eventArgs) =>
            {
                goToMenuItem.Text = propertyGrid.SelectedGridItem != null ? string.Format("Go to {0}", propertyGrid.SelectedGridItem.Label) : null;
                goToMenuItem.Visible = propertyGrid.SelectedGridItem != null && propertyGrid.SelectedGridItem.Value != null;
                goBackMenuItem.Visible = selectedObjectStack.Count > 0;
            };

            propertyGrid.Dock = DockStyle.Fill;
            propertyGrid.ContextMenu = contextMenu;
            propertyGrid.SelectedObject = context;

            var form = new Form();
            form.Controls.Add(propertyGrid);
            form.Size = new Size(400, 300);
            form.ShowDialog();
        }
    }

}
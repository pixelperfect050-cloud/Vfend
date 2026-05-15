using System;
using System.Windows.Forms;
using System.Drawing;
using System.Collections.Generic;

namespace MorseCodeConverter
{
    public class MainForm : Form
    {
        private TextBox inputTextBox;
        private TextBox outputTextBox;
        private Button convertButton;
        private Button clearButton;
        private Label inputLabel;
        private Label outputLabel;

        private static readonly Dictionary<char, string> MorseCodeMap = new Dictionary<char, string>
        {
            {'A', ".-"}, {'B', "-..."}, {'C', "-.-."}, {'D', "-.."}, {'E', "."},
            {'F', "..-."}, {'G', "--."}, {'H', "...."}, {'I', ".."}, {'J', ".---"},
            {'K', "-.-"}, {'L', ".-.."}, {'M', "--"}, {'N', "-."}, {'O', "---"},
            {'P', ".--."}, {'Q', "--.-"}, {'R', ".-."}, {'S', "..."}, {'T', "-"},
            {'U', "..-"}, {'V', "...-"}, {'W', ".--"}, {'X', "-..-"}, {'Y', "-.--"},
            {'Z', "--.."},
            {'0', "-----"}, {'1', ".----"}, {'2', "..---"}, {'3', "...--"}, {'4', "....-"},
            {'5', "....."}, {'6', "-...."}, {'7', "--..."}, {'8', "---.."}, {'9', "----."},
            {' ', " / "}
        };

        public MainForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Morse Code Converter";
            this.Size = new Size(500, 400);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(240, 240, 245);

            inputLabel = new Label
            {
                Text = "Enter Text:",
                Location = new Point(30, 30),
                AutoSize = true,
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                ForeColor = Color.FromArgb(50, 50, 80)
            };

            inputTextBox = new TextBox
            {
                Location = new Point(30, 60),
                Size = new Size(420, 30),
                Font = new Font("Segoe UI", 11),
                Multiline = false,
                BorderStyle = BorderStyle.FixedSingle
            };
            inputTextBox.KeyPress += InputTextBox_KeyPress;

            convertButton = new Button
            {
                Text = "Convert to Morse Code",
                Location = new Point(30, 110),
                Size = new Size(200, 35),
                FlatStyle = FlatStyle.Flat,
                BackColor = Color.FromArgb(70, 130, 180),
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            convertButton.FlatAppearance.BorderSize = 0;
            convertButton.Click += ConvertButton_Click;

            clearButton = new Button
            {
                Text = "Clear",
                Location = new Point(250, 110),
                Size = new Size(200, 35),
                FlatStyle = FlatStyle.Flat,
                BackColor = Color.FromArgb(200, 100, 100),
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            clearButton.FlatAppearance.BorderSize = 0;
            clearButton.Click += ClearButton_Click;

            outputLabel = new Label
            {
                Text = "Morse Code:",
                Location = new Point(30, 170),
                AutoSize = true,
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                ForeColor = Color.FromArgb(50, 50, 80)
            };

            outputTextBox = new TextBox
            {
                Location = new Point(30, 200),
                Size = new Size(420, 80),
                Font = new Font("Courier New", 12),
                Multiline = true,
                ReadOnly = true,
                BackColor = Color.White,
                BorderStyle = BorderStyle.FixedSingle,
                ScrollBars = ScrollBars.Vertical
            };

            this.Controls.Add(inputLabel);
            this.Controls.Add(inputTextBox);
            this.Controls.Add(convertButton);
            this.Controls.Add(clearButton);
            this.Controls.Add(outputLabel);
            this.Controls.Add(outputTextBox);
        }

        private void InputTextBox_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.Enter)
            {
                ConvertToMorse();
                e.Handled = true;
            }
        }

        private void ConvertButton_Click(object sender, EventArgs e)
        {
            ConvertToMorse();
        }

        private void ClearButton_Click(object sender, EventArgs e)
        {
            inputTextBox.Clear();
            outputTextBox.Clear();
            inputTextBox.Focus();
        }

        private void ConvertToMorse()
        {
            string input = inputTextBox.Text.ToUpper();
            string morseResult = "";

            foreach (char c in input)
            {
                if (MorseCodeMap.ContainsKey(c))
                {
                    morseResult += MorseCodeMap[c] + " ";
                }
            }

            outputTextBox.Text = morseResult.Trim();
        }
    }
}
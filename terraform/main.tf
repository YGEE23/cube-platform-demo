# 1. Define the AWS Provider
provider "aws" {
  region = "us-east-1" # You can change this if you prefer another region
}

# 2. Tell AWS to use the public key we just generated locally
resource "aws_key_pair" "deployer" {
  key_name   = "cube-demo-deployer-key"
  public_key = file("../cube-demo-key.pub")
}

# 3. Create a Security Group to allow web traffic and SSH
resource "aws_security_group" "web_sg" {
  name        = "cube-demo-web-sg"
  description = "Allow HTTP and SSH inbound traffic"

  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Find the latest Ubuntu 22.04 Image dynamically
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical's official AWS account ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 5. Provision the EC2 Instance (Free Tier Eligible)
resource "aws_instance" "web_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  # 6. Install Docker automatically when the server boots
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "Cube-Platform-Demo-Server"
  }
}

# 7. Output the public IP so we know where to view the app
output "server_public_ip" {
  value       = aws_instance.web_server.public_ip
  description = "The public IP address of the web server"
}

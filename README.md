# African Rock Art

[![Build Status](https://travis-ci.org/kingsdigitallab/african-rock-art.svg?branch=develop)](https://travis-ci.org/kingsdigitallab/african-rock-art)

## Requirements

* GNU/Linux, Unix, or macOS
* Ruby version 2.1 or above, including all development headers
* [RubyGems](https://rubygems.org/pages/download)
* [GCC](https://gcc.gnu.org/install/) and [Make](https://www.gnu.org/software/make/)

## How to Run

```bash
echo "Clone repository"
git clone git@github.com:kingsdigitallab/african-rock-art.git
echo "Install Bundler gem"
gem install bundler
echo "Go to the project directory"
cd african-rock-art && git checkout develop
echo "Install Dependencies"
bundle install --path vendor/bundle && bundle install
echo "Edit Contentful settings"
cp env.sh.sample env.sh && nano env.sh
echo "Import and process Contentful data"
rake contentful
echo "Start Jekyll Server"
rake serve
```

Open your browser and go to: [localhost:4000](http://localhost:4000)
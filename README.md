# African Rock Art

[![Build Status](https://travis-ci.org/kingsdigitallab/african-rock-art.svg?branch=develop)](https://travis-ci.org/kingsdigitallab/african-rock-art)

## Requirements

The project is built with [Jekyll](https://jekyllrb.com/), which has the following requirements:
* GNU/Linux, Unix, or macOS
* Ruby version 2.1 or above, including all development headers
* [RubyGems](https://rubygems.org/pages/download)
* [GCC](https://gcc.gnu.org/install/) and [Make](https://www.gnu.org/software/make/)

## How to Run

```bash
echo "Clone repository"
git clone git@github.com:kingsdigitallab/african-rock-art.git
echo "Go to the project directory"
cd african-rock-art && git checkout develop
echo "Install Bundler gem (may need sudo)"
[sudo] gem install bundler
echo "Install Dependencies"
bundle install --path vendor/bundle && bundle install
echo "Start Jekyll Server"
bundle exec rake serve
```

Open your browser and go to: [localhost:4000](http://localhost:4000)

## Contentful

To import content from the Contentful CMS, copy the file `env.sh.sample` into a file named `env.sh` and edit the Contentful API settings.

```bash
echo "Edit Contentful settings"
cp env.sh.sample env.sh && nano env.sh
echo "Import and process Contentful data"
bundle exec rake contentful
```

## Utilities

The project has a `Rakefile` that contains taks and build utilities. To see the tasks available run the command `bundle exec rake --tasks` inside the project directory. Current tasks:

```bash
$ bundle exec rake --tasks
rake build:dev                 # Regenerate files for development
rake build:prod                # Regenerate files for production
rake contentful:all            # Import and process data from Contentful
rake contentful:assets[force]  # Import assets from Contentful; by default it only downloads new images, to overwrite existing images do `rake contentful:assets[true]`
rake contentful:import         # Import data from Contentful
rake contentful:process        # Process imported data: re-maps Contentful content types and creates content pages
rake contentful:resize         # Resizes the images imported from Contentful to a maximum of 500k
rake gallery                   # Creates surrogates for the gallery images
rake rubocop                   # Run RuboCop
rake rubocop:auto_correct      # Auto-correct RuboCop offenses
rake serve:dev                 # Serve development Jekyll site locally
rake serve:prod                # Serve production Jekyll site locally
rake test:all                  # Test development and production sites
rake test:dev                  # Test development site
rake test:prod                 # Test production site
```

By default, running `bundle exec rake` will run the `test:all` task. [ImageMagick](https://www.imagemagick.org/) is needed to run the `contentful:resize`  task.
# frozen_string_literal: true

require 'colorize'
require 'html-proofer'
require 'mkmf'
require 'open-uri'
require 'rubocop/rake_task'
require 'yaml'

CONTENTFUL_LABELS = {
  '2MFOT4WINOAOokOw2ma6aS': 'featured_site',
  '3NZwbeG360yGuoKUUCU8Oy': 'image',
  '4WLq0TTLleEcMmEYw66Q8w': 'thematic',
  '4avEHZ2i4EkkmWQGg6Cc0c': 'embeded_media',
  '4fXS1cA1XGKq4a6IM86Wm': 'country_key_facts',
  '5BpsmbwGhUi8wYwIEKO0Oa': 'introduction',
  '76etbn9kNUiAY0q6YYu0SY': 'project_page',
  '7Ak9U6HXygSaUMmQQWIGQu': 'chapter',
  '7Kul7fgXh6YSseagSee8co': 'regional_introduction',
  '7bbOALHvAQ8cQ6yS2wOmw0': 'citation',
  'Q4XNev9Iom0uGquue2eoS': 'country_information',
  'fS8J0UehVuo8YuO2AswYS': 'country'
}.freeze

CONTENTFUL_IGNORED_CONTENT_TYPES = %w[
  chapter citation country_key_facts embeded_media featured_site
  image project_page
].freeze

IMAGES_PATH = 'assets/images/site'

# -----------------------------------------------------------------------------
# Default task
# -----------------------------------------------------------------------------

task default: %w[test]

# -----------------------------------------------------------------------------
# Rubocop tasks
# -----------------------------------------------------------------------------

RuboCop::RakeTask.new

# -----------------------------------------------------------------------------
# Jekyll tasks
# -----------------------------------------------------------------------------

# Usage: rake serve, rake serve:prod
task serve: ['serve:dev']
namespace :serve do
  desc 'Serve development Jekyll site locally'
  task :dev do
    puts 'Starting up development Jekyll site server...'.yellow
    ENV['JEKYLL_ENV'] = 'development'
    system 'bundle exec jekyll serve --config _config.yml,_config.local.yml'
  end

  desc 'Serve production Jekyll site locally'
  task :prod do
    puts 'Starting up production Jekyll site server...'.yellow
    ENV['JEKYLL_ENV'] = 'production'
    system 'bundle exec jekyll serve --no-watch'
  end
end

# Usage: rake build, rake build:prod
task build: ['build:dev']
namespace :build do
  desc 'Regenerate files for development'
  task :dev do
    puts 'Regenerating files for development...'.yellow
    ENV['JEKYLL_ENV'] = 'development'
    system 'bundle exec jekyll build '\
      '--trace --config _config.yml,_config.local.yml --profile'
  end

  desc 'Regenerate files for production'
  task :prod do
    puts 'Regenerating files for production...'.yellow
    ENV['JEKYLL_ENV'] = 'production'
    system 'bundle exec jekyll build --trace'
  end
end

# Usage: rake test, rake test:prod
task test: ['test:all']
namespace :test do
  options = {
    allow_hash_href: true,
    cache: {
      timeframe: '30d'
    },
    assume_extension: true,
    disable_external: true,
    internal_domains: ['kingsdigitallab.github.io'],
    empty_alt_ignore: true,
    url_swap: { %r{/african-rock-art/?} => '/' }
  }

  desc 'Test development and production sites'
  task :all do
    puts 'Testing development and production sites'.yellow
    Rake::Task['test:dev'].invoke
    puts '---'.yellow
    Rake::Task['test:prod'].invoke
  end

  desc 'Test development site'
  task :dev do
    puts 'Validating development HTML output in _site...'.yellow
    Rake::Task['build:dev'].invoke
    HTMLProofer.check_directory('./_site', options).run
  end

  desc 'Test production site'
  task :prod do
    puts 'Validating production HTML output in _site...'.yellow
    Rake::Task['build:prod'].invoke
    HTMLProofer.check_directory('./_site', options).run
  end
end

# -----------------------------------------------------------------------------
# Contentful tasks
# -----------------------------------------------------------------------------

# Usage: rake contentful, rake contentful:import, rake:process
task contentful: ['contentful:all']
namespace :contentful do
  desc 'Import and process data from Contentful'
  task :all do
    puts 'Contentful data import and processing...'.yellow
    Rake::Task['contentful:import'].invoke
    puts '---'.yellow
    Rake::Task['contentful:process'].invoke
    puts '---'.yellow
    Rake::Task['contentful:assets'].invoke
    puts '---'.yellow
    Rake::Task['contentful:resize'].invoke
  end

  desc 'Import data from Contentful'
  task :import do
    puts 'Contentful data import...'.yellow
    system '. ./env.sh && bundle exec jekyll contentful'
  end

  desc 'Process imported data: '\
    're-maps Contentful content types and creates content pages'
  task :process do
    puts 'Contentful data processing...'.yellow

    yaml_path = File.join(Dir.pwd, '_data/ara.yaml')
    yaml_data = File.read(yaml_path)

    # some terms are encoded in the content using | which should not be
    # converted into HTML tables, so they need to be escaped
    yaml_data = yaml_data.gsub(/(\w*)\|([a-zA-Z]\w+)/, '\1&#124;\2')
    CONTENTFUL_LABELS.each do |key, value|
      yaml_data = yaml_data.gsub(Regexp.quote(key), value)
    end

    File.open(yaml_path, 'w') do |f|
      f.write(yaml_data)
      f.close
    end

    yaml = YAML.load_file(yaml_path)
    yaml.each do |key, value|
      unless CONTENTFUL_IGNORED_CONTENT_TYPES.include?(key)
        create_content_pages(key, value)
      end
    end
  end

  desc 'Import assets from Contentful; '\
    'by default it only downloads new images, '\
    'to overwrite existing images do `rake contentful:assets[true]`'
  task :assets, [:force] do |_t, args|
    args.with_defaults(force: false)
    force = args[:force]

    puts 'Contentful assets import...'.yellow
    Dir.mkdir(IMAGES_PATH) unless File.exist?(IMAGES_PATH)

    Rake::Task['contentful:process'].invoke

    yaml_path = File.join(Dir.pwd, '_data/ara.yaml')
    yaml = YAML.load_file(yaml_path)

    yaml.each do |key, value|
      case key
      when 'image'
        value.each do |item|
          download_image(item['image'], force) if item['image']
        end
      when 'country'
        value.each do |country|
          next unless country['image_carousel'] || country['background_images']
          images = []
          images += country['image_carousel'] if country['image_carousel']
          images += country['background_images'] if country['background_images']
          images.each do |image|
            download_image(image, force)
          end
        end
      when 'thematic'
        value.each do |theme|
          next unless theme['lead_image'] || theme['background_images']
          images = []
          images += [theme['lead_image']] if theme['lead_image']
          images += theme['background_images'] if theme['background_images']
          images.each do |image|
            download_image(image, force)
          end
        end
      end
    end
  end

  desc 'Resizes the images imported from Contentful to a maximum of 500k'
  task :resize do
    puts 'Resizing images...'.yellow

    low_quality_path = "#{IMAGES_PATH}/low"
    Dir.mkdir(low_quality_path) unless File.exist?(low_quality_path)

    if find_executable('mogrify')
      %w[jpg].each do |ext|
        puts "Resizing #{ext}s...".yellow
        system "mogrify -resize 540x560 -quality 100 \
          -define jpeg:extent=500kb #{IMAGES_PATH}/*.#{ext}"
        system "mogrify -path #{low_quality_path} \
          -quality 10 #{IMAGES_PATH}/*.#{ext}"

        %w[140x140 300x180].each do |size|
          puts "Creating #{size} surrogates...".green
          size_path = "#{IMAGES_PATH}/#{size}"
          Dir.mkdir(size_path) unless File.exist?(size_path)
          low_quality_path = "#{size_path}/low"
          Dir.mkdir(low_quality_path) unless File.exist?(low_quality_path)

          system "mogrify -path #{size_path} -resize #{size}^ \
            -gravity center -extent #{size} #{IMAGES_PATH}/*.#{ext}"
          system "mogrify -path #{low_quality_path} \
            -quality 10 #{size_path}/*.#{ext}"
        end
      end

      system "rm -f #{IMAGES_PATH}/*.*~"
    else
      puts 'Imagemagick not found'.red
    end
  end
end

# -----------------------------------------------------------------------------
# Gallery tasks
# -----------------------------------------------------------------------------

desc 'Creates surrogates for the gallery images'
task :gallery do
  puts 'Processing gallery images...'.yellow

  gallery_images_path = 'assets/images/gallery'

  low_quality_path = "#{gallery_images_path}/low"
  Dir.mkdir(low_quality_path) unless File.exist?(low_quality_path)

  if find_executable('mogrify')
    %w[jpg].each do |ext|
      puts "Resizing #{ext}s...".yellow
      system "mogrify -resize 540x560 -quality 100 \
          -define jpeg:extent=500kb #{gallery_images_path}/*.#{ext}"
      system "mogrify -path #{low_quality_path} \
          -quality 10 #{gallery_images_path}/*.#{ext}"

      %w[140x140 196x196].each do |size|
        puts "Creating #{size} surrogates...".green
        size_path = "#{gallery_images_path}/#{size}"
        Dir.mkdir(size_path) unless File.exist?(size_path)
        low_quality_path = "#{size_path}/low"
        Dir.mkdir(low_quality_path) unless File.exist?(low_quality_path)

        system "mogrify -path #{size_path} \
            -resize #{size} -background white -gravity center -extent #{size} \
            #{gallery_images_path}/*.#{ext}"
        system "mogrify -path #{low_quality_path} \
            -quality 10 #{size_path}/*.#{ext}"
      end
    end

    system "rm -f #{gallery_images_path}/*.*~"
  else
    puts 'Imagemagick not found'.red
  end
end

def create_content_pages(key, data)
  # Creates content specific directory (collection)
  dir_name = '_coll_' + key
  dir_path = File.join(Dir.pwd, dir_name)
  Dir.mkdir(dir_path) unless File.exist?(dir_path)

  # Creates one content file per item
  data.each do |item|
    item_hash = { 'contentful' => item }
    slug = item['sys']['id']

    %w[slug title name].each do |field|
      next unless item.include?(field) && !item[field].empty?
      slug = slugify(item[field])
      break
    end

    file_path = File.join(dir_path, slug + '.md')
    File.open(file_path, 'w') do |f|
      f.write(YAML.dump(item_hash))
      f.write('---')
    end

    next unless item.include?('featured_site')

    create_featured_site(dir_name, slug, item)
  end
end

def slugify(str)
  str.strip.downcase.gsub(/\W+/, '-')
end

def create_featured_site(country_dir_name, country_slug, data)
  featured_dir_name = country_dir_name + '/' + country_slug
  featured_dir_path = File.join(Dir.pwd, featured_dir_name)
  Dir.mkdir(featured_dir_path) unless File.exist?(featured_dir_path)

  featured_slug = data['featured_site']['slug']
  featured_item_hash = {
    'breadcrumbs' => [
      { 'label' => 'Countries', 'url' => '../../' },
      { 'label' => data['name'], 'url' => '../' }
    ],
    'layout' => 'featured_site',
    'contentful' => data['featured_site']
  }

  featured_file_path = File.join(featured_dir_path, featured_slug + '.md')
  File.open(featured_file_path, 'w') do |f|
    f.write(YAML.dump(featured_item_hash))
    f.write('---')
  end
end

def download_image(image, force)
  return unless image['url']

  url = "https:#{image['url']}?fm=jpg&fl=progressive&w=540&h=560"
  filename = url.split('/')[-1].split('?')[0]
  filename = File.basename(filename, File.extname(filename))
  filename = "#{IMAGES_PATH}/#{filename}.jpg"

  return unless force || !File.file?(filename)

  puts "Downloading #{url}:".green
  puts " into #{filename}".blue
  download = open(url)
  IO.copy_stream(download, filename)
end

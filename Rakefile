require 'yaml'

# -----------------------------------------------------------------------------
# Jekyll tasks
# -----------------------------------------------------------------------------

# Usage: rake serve, rake serve:prod
task :serve => ['serve:dev']
namespace :serve do

  desc 'Serve development Jekyll site locally'
  task :dev do
    puts 'Starting up development Jekyll site server...'
    system 'bundle exec jekyll serve --config _config.yml,_config.local.yml'
  end

  desc 'Serve production Jekyll site locally'
  task :prod do
    puts 'Starting up production Jekyll site server...'
    system 'bundle exec jekyll serve --no-watch'
  end
end

# Usage: rake build, rake build:dev, rake build:drafts
task :build => ['build:dev']
namespace :build do

  desc 'Regenerate files for development'
  task :dev do
    puts 'Regenerating files for development...'
    system 'bundle exec jekyll build --config _config.yml,_config.local.yml --profile'
  end

  desc 'Regenerate files for production'
  task :prod do
    puts 'Regenerating files for production...'
    system 'JEKYLL_ENV=production bundle exec jekyll build'
  end
end

desc 'Test site'
task :test do
  puts 'Validating HTML output in _site...'
  system 'bundle exec htmlproofer ./_site'
end

# -----------------------------------------------------------------------------
# Contentful tasks
# -----------------------------------------------------------------------------

desc 'Import data from Contentful'
task :contentful do
  puts 'Contentful data import...'
  system '. ./env.sh && bundle exec jekyll contentful'
end

desc 'Remap Contentful content type ids into human readable labels'
task :remap_contentful_content_type do
  labels = {
    '2MFOT4WINOAOokOw2ma6aS' => 'featured_site',
    '3NZwbeG360yGuoKUUCU8Oy' => 'image',
    '4WLq0TTLleEcMmEYw66Q8w' => 'thematic',
    '4avEHZ2i4EkkmWQGg6Cc0c' => 'embeded_media',
    '4fXS1cA1XGKq4a6IM86Wm' => 'country_key_facts',
    '5BpsmbwGhUi8wYwIEKO0Oa' => 'introduction',
    '76etbn9kNUiAY0q6YYu0SY' => 'project_page',
    '7Ak9U6HXygSaUMmQQWIGQu' => 'chapter',
    '7Kul7fgXh6YSseagSee8co' => 'regional_introduction',
    '7bbOALHvAQ8cQ6yS2wOmw0' => 'citation',
    'Q4XNev9Iom0uGquue2eoS' => 'country_information',
    'fS8J0UehVuo8YuO2AswYS' => 'country'
  }

  dont_create_pages_for = ['embeded_media', 'image', 'project_page']

  yaml_path = File.join(Dir.pwd, '_data/ara.yaml')
  yaml = YAML::load_file(yaml_path)

  new_yaml = {}
  yaml.each do |key, value|
    # Converts content type ids into labels
    key = labels[key] if labels.key?(key)
    new_yaml[key] = value

    if not dont_create_pages_for.include?(key)
      create_content_pages(key, value)
    end
  end

  File.open(yaml_path, 'w') do |f|
    f.write(YAML.dump(new_yaml))
  end
end

def create_content_pages(key, data)
  # Creates content specific directory (collection)
  dir_name = '_coll_' + key
  dir_path = File.join(Dir.pwd, dir_name)
  Dir.mkdir(dir_path) unless File.exists?(dir_path)

  # Creates one content file per item
  data.each do |item|
    item_hash = {'layout' => key, 'contentful' => item}
    slug = 'home'

    if item['slug']
      slug = item['slug']
    elsif item['title']
      slug = slugify(item['title'])
    elsif item['name']
      slug = slugify(item['name'])
    end

    file_path = File.join(dir_path, slug + '.md')
    File.open(file_path, 'w') do |f|
      f.write(YAML.dump(item_hash))
      f.write('---')
    end
  end
end

def slugify(str)
  str.strip.downcase.gsub(/\W+/, '-')
end

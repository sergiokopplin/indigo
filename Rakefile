require 'html/proofer'

# rake test
desc "build and test website"

task :test do
    sh "bundle exec jekyll build"
    options = { :assume_extension => true, :href_ignore=> ['http://localhost:4000'], :verbose => true }
    HTMLProofer.check_directory("./_site", options).run
end

bundle exec htmlproofer --http-status-ignore "403" --url-ignore "/github.githubassets.com/,/koppl.in/" ./_site
